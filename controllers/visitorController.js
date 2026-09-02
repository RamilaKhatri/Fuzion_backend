const crypto = require("crypto");
const { Op, fn, col, literal } = require("sequelize");
const sequelize = require("../config/database");
const Visitor = require("../models/Visitor");
const Notification = require("../models/Notification");

// milestones to notify once
const MILESTONES = [100, 500, 1000, 5000, 10000, 25000, 50000, 100000];

function hashIdentifier(raw) {
    return crypto.createHash("sha256").update(String(raw)).digest("hex").slice(0, 32);
}

function dayBounds(date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return { start, end };
}
function utcDayStart(d){
    const x=new Date(d);
    x.setUTCHours(0,0,0,0);
    return x;
}

const trackVisit = async (req, res, next) => {
    try {
        const { visitorId, page } = req.body;

        // visitorId is an anonymous id generated on frontend and stored in localStorage
        // Fallback: hash of IP + user-agent for deduplication without storing raw IP
        let rawId = visitorId;
        if (!rawId) {
            const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip || "unknown";
            const ua = req.headers["user-agent"] || "";
            rawId = `${ip}|${ua}|${new Date().toISOString().slice(0, 10)}`;
        }

        const visitorHash = hashIdentifier(rawId);
        const cleanPage = page ? String(page).slice(0, 500) : "/";

        await Visitor.create({
            visitorHash,
            page: cleanPage,
            visitedAt: new Date()
        });

        // Milestone check (non-blocking, best effort)
        try {
            const totalVisitors = await Visitor.count({
                distinct: true,
                col: "visitorHash"
            });
            // Alternative accurate distinct count for sqlite
            // Use aggregate if needed already covered

            for (const milestone of MILESTONES) {
                if (totalVisitors === milestone) {
                    const exists = await Notification.findOne({
                        where: { type: "visitor_milestone", relatedId: milestone }
                    });
                    if (!exists) {
                        await Notification.create({
                            type: "visitor_milestone",
                            title: "Visitor Milestone",
                            message: `Your website has reached ${milestone.toLocaleString()} total visitors.`,
                            link: "/dashboard.html",
                            relatedId: milestone,
                            read: false
                        });
                    }
                    break;
                }
            }
        } catch (_) { /* ignore milestone errors */ }

        res.json({ ok: true });
    } catch (e) { next(e); }
};

const getAnalytics = async (req, res, next) => {
    try {
        const now = new Date();
        const today = dayBounds(now);
        const yesterdayDate = new Date(now);
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterday = dayBounds(yesterdayDate);

        const sevenDaysAgo = utcDayStart(new Date(now.getTime() - 6*24*60*60*1000));
        const thirtyDaysAgo = utcDayStart(new Date(now.getTime() - 29*24*60*60*1000));

        // Use visitedAt for all metrics
        const [
            todayVisitors,
            yesterdayVisitors,
            last7Visitors,
            last30Visitors,
            totalVisitors,
            todayPageViews,
            totalPageViews
        ] = await Promise.all([
            Visitor.count({ distinct: true, col: "visitorHash", where: { visitedAt: { [Op.between]: [today.start, today.end] } } }),
            Visitor.count({ distinct: true, col: "visitorHash", where: { visitedAt: { [Op.between]: [yesterday.start, yesterday.end] } } }),
            Visitor.count({ distinct: true, col: "visitorHash", where: { visitedAt: { [Op.gte]: sevenDaysAgo } } }),
            Visitor.count({ distinct: true, col: "visitorHash", where: { visitedAt: { [Op.gte]: thirtyDaysAgo } } }),
            Visitor.count({ distinct: true, col: "visitorHash" }),
            Visitor.count({ where: { visitedAt: { [Op.between]: [today.start, today.end] } } }),
            Visitor.count()
        ]);

        // Daily breakdown for last 7 and last 30 days
        // Group by date string - dialect aware
        const isPostgres = sequelize.getDialect() === "postgres";

        async function dailyBreakdown(fromDate, days) {
            const rows = await Visitor.findAll({
                attributes: [
                    [isPostgres
                        ? literal(`DATE("visitedAt")`)
                        : literal(`DATE("visitedAt")`), "date"],
                    [fn("COUNT", col("id")), "pageViews"],
                    [literal(`COUNT(DISTINCT "visitorHash")`), "visitors"]
                ],
                where: { visitedAt: { [Op.gte]: fromDate } },
                group: [literal(`DATE("visitedAt")`)],
                order: [[literal(`DATE("visitedAt")`), "ASC"]],
                raw: true
            });

            // For sqlite COUNT DISTINCT workaround, if visitors is wrong, fallback manual
            // Map to date -> counts
            const map = {};
            rows.forEach(r => {
                const d = typeof r.date === "string" ? r.date.slice(0, 10) : new Date(r.date).toISOString().slice(0, 10);
                map[d] = { visitors: Number(r.visitors), pageViews: Number(r.pageViews) };
            });

            // Fill missing days with 0
            const result = [];
            for (let i = 0; i < days; i++) {
                const d = new Date(fromDate);
                d.setDate(d.getDate() + i);
                const key = d.toISOString().slice(0, 10);
                result.push({
                    date: key,
                    visitors: map[key]?.visitors || 0,
                    pageViews: map[key]?.pageViews || 0
                });
            }
            return result;
        }

        const last7Days = await dailyBreakdown(sevenDaysAgo, 7);
        const last30Days = await dailyBreakdown(thirtyDaysAgo, 30);

        res.json({
            today: { visitors: todayVisitors, pageViews: todayPageViews },
            yesterday: { visitors: yesterdayVisitors },
            last7Days: { visitors: last7Visitors, daily: last7Days },
            last30Days: { visitors: last30Visitors, daily: last30Days },
            total: { visitors: totalVisitors, pageViews: totalPageViews }
        });
    } catch (e) { next(e); }
};

module.exports = { trackVisit, getAnalytics };
