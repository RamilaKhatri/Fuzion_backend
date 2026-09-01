function getToken() {
    return localStorage.getItem("token");
}


function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    window.location.href = "/login.html";
}


function apiHeaders() {

    const token = getToken();

    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
}


function escapeHtml(value) {

    return String(value ?? "").replace(
        /[&<>"']/g,
        function (character) {

            const map = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return map[character];
        }
    );
}


async function api(url, options = {}) {

    const token = getToken();


    if (!token) {

        window.location.href = "/login.html";

        throw new Error("Login required");
    }


    const response = await fetch(
        url,
        {
            ...options,

            headers: {
                ...apiHeaders(),
                ...(options.headers || {})
            }
        }
    );


    const data = await response
        .json()
        .catch(() => ({}));


    if (
        response.status === 401 ||
        response.status === 403
    ) {

        if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("admin");

            window.location.href = "/login.html";
        }

        throw new Error(
            data.message || "Access denied"
        );
    }


    if (!response.ok) {

        throw new Error(
            data.message || "Request failed"
        );
    }


    return data;
}

/* =========================================================
   RESPONSIVE SIDEBAR - MOBILE TOGGLE
   Injected automatically for all admin pages
   Does NOT interfere with existing functionality
========================================================= */

(function () {
    if (typeof document === "undefined") return;

    function initResponsiveSidebar() {
        var sidebar = document.querySelector(".sidebar");
        var layout = document.querySelector(".layout");

        if (!sidebar || !layout) return;

        // Avoid double-injection
        if (document.querySelector(".mobile-topbar")) return;

        // Create mobile topbar
        var topbar = document.createElement("div");
        topbar.className = "mobile-topbar";
        topbar.innerHTML =
            '<div class="mobile-topbar-brand"><span>FUZION</span><small>CAFE ADMIN</small></div>' +
            '<button type="button" class="sidebar-toggle" aria-label="Toggle navigation" aria-expanded="false">' +
            '<i class="fa-solid fa-bars"></i>' +
            '</button>';

        // Create overlay
        var overlay = document.createElement("div");
        overlay.className = "sidebar-overlay";
        overlay.setAttribute("aria-hidden", "true");

        // Insert topbar before layout
        document.body.insertBefore(topbar, document.body.firstChild);
        document.body.appendChild(overlay);

        var toggleBtn = topbar.querySelector(".sidebar-toggle");
        var icon = toggleBtn.querySelector("i");

        function openSidebar() {
            sidebar.classList.add("open");
            overlay.classList.add("active");
            toggleBtn.setAttribute("aria-expanded", "true");
            if (icon) icon.className = "fa-solid fa-xmark";
            document.body.style.overflow = "hidden";
        }

        function closeSidebar() {
            sidebar.classList.remove("open");
            overlay.classList.remove("active");
            toggleBtn.setAttribute("aria-expanded", "false");
            if (icon) icon.className = "fa-solid fa-bars";
            document.body.style.overflow = "";
        }

        function isMobile() {
            return window.innerWidth <= 768;
        }

        toggleBtn.addEventListener("click", function () {
            if (sidebar.classList.contains("open")) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });

        overlay.addEventListener("click", closeSidebar);

        // Close on nav link click on mobile
        sidebar.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                if (isMobile()) closeSidebar();
            });
        });

        // Close on Escape
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && sidebar.classList.contains("open")) {
                closeSidebar();
            }
        });

        // On resize to desktop, ensure sidebar is visible and overlay hidden
        window.addEventListener("resize", function () {
            if (!isMobile()) {
                closeSidebar();
                sidebar.classList.remove("open");
                overlay.classList.remove("active");
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initResponsiveSidebar);
    } else {
        initResponsiveSidebar();
    }
})();