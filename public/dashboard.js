// ==========================================
// FUZION CAFE ADMIN DASHBOARD
// ==========================================

const token =
    localStorage.getItem("authToken") ||
    localStorage.getItem("token");

// ==========================================
// CHECK LOGIN
// ==========================================

if (!token) {
    window.location.href = "/login.html";
}


// ==========================================
// LOAD DASHBOARD
// ==========================================

async function loadDashboard() {

    try {

        const response = await fetch(
            "/api/admin/dashboard",
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();

        console.log("Dashboard response:", data);


        // ==========================================
        // TOKEN INVALID / EXPIRED
        // ==========================================

        if (response.status === 401) {

            localStorage.removeItem("authToken");
            localStorage.removeItem("token");

            window.location.href = "/login.html";

            return;
        }


        // ==========================================
        // ADMIN ACCESS DENIED
        // ==========================================

        if (response.status === 403) {

            alert(
                data.message ||
                "You do not have permission to access the admin dashboard."
            );

            return;
        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load dashboard"
            );

        }


        // ==========================================
        // STATISTICS
        // ==========================================

        if (data.statistics) {

            document.getElementById("totalUsers").textContent =
                data.statistics.totalUsers || 0;

            document.getElementById("totalMenu").textContent =
                data.statistics.totalMenuItems || 0;

            document.getElementById("totalBookings").textContent =
                data.statistics.totalBookings || 0;

            document.getElementById("totalEnquiries").textContent =
                data.statistics.totalEnquiries || 0;

            document.getElementById("totalOrders").textContent =
                data.statistics.totalOrders || 0;

            const totalGallery =
                document.getElementById("totalGallery");

            if (totalGallery) {
                totalGallery.textContent =
                    data.statistics.totalGalleryItems || 0;
            }

            const pendingBookings =
                document.getElementById("pendingBookings");

            if (pendingBookings) {
                pendingBookings.textContent =
                    data.statistics.pendingBookings || 0;
            }

            const pendingEnquiries =
                document.getElementById("pendingEnquiries");

            if (pendingEnquiries) {
                pendingEnquiries.textContent =
                    data.statistics.pendingEnquiries || 0;
            }

            const totalProjects =
                document.getElementById("totalProjects");

            if (totalProjects) {
                totalProjects.textContent =
                    data.statistics.totalProjects || 0;
            }
        }


        // ==========================================
        // RECENT BOOKINGS
        // ==========================================

        if (
            data.recent &&
            Array.isArray(data.recent.bookings)
        ) {

            const recentBookings =
                document.getElementById("recentBookings");

            if (recentBookings) {

                if (data.recent.bookings.length) {

                    recentBookings.innerHTML =
                        data.recent.bookings
                            .map(booking => `
                                <p>
                                    <b>
                                        ${escapeHtml(
                                            booking.name || "Unknown"
                                        )}
                                    </b>
                                    ·
                                    ${escapeHtml(
                                        booking.date || "No date"
                                    )}
                                    ·
                                    <span class="status">
                                        ${escapeHtml(
                                            booking.status || "Pending"
                                        )}
                                    </span>
                                </p>
                            `)
                            .join("");

                } else {

                    recentBookings.textContent =
                        "No bookings yet.";

                }
            }
        }


        // ==========================================
        // RECENT ENQUIRIES
        // ==========================================

        if (
            data.recent &&
            Array.isArray(data.recent.enquiries)
        ) {

            const recentEnquiries =
                document.getElementById("recentEnquiries");

            if (recentEnquiries) {

                if (data.recent.enquiries.length) {

                    recentEnquiries.innerHTML =
                        data.recent.enquiries
                            .map(enquiry => `
                                <p>
                                    <b>
                                        ${escapeHtml(
                                            enquiry.name || "Unknown"
                                        )}
                                    </b>
                                    ·
                                    ${escapeHtml(
                                        enquiry.subject ||
                                        "General enquiry"
                                    )}
                                    ·
                                    <span class="status">
                                        ${escapeHtml(
                                            enquiry.status ||
                                            "Pending"
                                        )}
                                    </span>
                                </p>
                            `)
                            .join("");

                } else {

                    recentEnquiries.textContent =
                        "No enquiries yet.";

                }
            }
        }


    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

        const message =
            document.getElementById("message");

        if (message) {

            message.style.display = "block";

            message.textContent =
                error.message ||
                "Unable to load dashboard data.";

            message.style.background =
                "#f8d7da";

            message.style.color =
                "#842029";
        }
    }
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");

    window.location.href =
        "/login.html";
}


// ==========================================
// VISITOR ANALYTICS
// ==========================================
let _vaData = null;
async function loadVisitorAnalytics(){
  try{
    const r=await fetch("/api/visitors/analytics",{headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"}});
    if(!r.ok) return;
    const d=await r.json();
    _vaData=d;
    const el=(id,v)=>{const e=document.getElementById(id); if(e) e.textContent=v;};
    el("vaTodayVisitors", d.today?.visitors ?? 0);
    el("vaTodayPageViews", d.today?.pageViews ?? 0);
    el("vaTotalVisitors", d.total?.visitors ?? 0);
    el("vaTotalPageViews", d.total?.pageViews ?? 0);
    el("vaYesterday", d.yesterday?.visitors ?? 0);
    el("vaLast7", d.last7Days?.visitors ?? 0);
    el("vaLast30", d.last30Days?.visitors ?? 0);
    renderVisitorChart(7);
  }catch(e){ console.error("visitor analytics",e); }
}
function renderVisitorChart(days){
  if(!_vaData) return;
  const arr = days===30 ? (_vaData.last30Days?.daily||[]) : (_vaData.last7Days?.daily||[]);
  const container=document.getElementById("visitorChartBars");
  if(!container) return;
  const max=Math.max(1, ...arr.map(x=>x.visitors));
  container.innerHTML=arr.map(x=>{
    const h=Math.round((x.visitors/max)*140);
    const label=new Date(x.date).toLocaleDateString(undefined,{month:"short",day:"numeric"});
    const weekday=new Date(x.date).toLocaleDateString(undefined,{weekday:"short"});
    return `<div class="visitor-chart-bar-wrap"><div class="visitor-chart-bar" style="height:${h}px"><span>${x.visitors}</span></div><div class="visitor-chart-label">${days===7?weekday:label}</div></div>`;
  }).join("");
  document.querySelectorAll(".visitor-analytics-tab").forEach(b=>{
    b.classList.toggle("active", Number(b.dataset.range)===days);
  });
}
document.addEventListener("click",e=>{
  const t=e.target.closest(".visitor-analytics-tab");
  if(t && _vaData) renderVisitorChart(Number(t.dataset.range));
});

// ==========================================
// START DASHBOARD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    ()=>{ loadDashboard(); loadVisitorAnalytics(); }
);