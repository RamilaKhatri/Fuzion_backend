const GoogleReview = require("../models/GoogleReview");
const { syncGoogleReviews } = require("../services/googleReviewSync");

/*
   Public - frontend calls this.
   Serves whatever is already saved in the DB.
   Does NOT call Apify - fast and free.
*/

const getGoogleReviews = async (req, res, next) => {
    try {
        const reviews = await GoogleReview.findAll({
            where: { status: "Active" },
            order: [["publishedAtDate", "DESC"]]
        });

        return res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
};

/*
   Admin only - manually trigger a fresh
   Apify sync without waiting for the
   daily cron job (e.g. after a new review
   just came in on Google).
*/

const triggerGoogleReviewSync = async (req, res, next) => {
    try {
        // Don't block the response - sync can
        // take a while depending on maxReviews.
        res.status(202).json({
            message: "Google review sync started. Check back shortly."
        });

        syncGoogleReviews();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getGoogleReviews,
    triggerGoogleReviewSync
};