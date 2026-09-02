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

/* =========================================================
   NOTIFICATION BELL - injected on every admin page
   Polling every 20s for unread count + list
   ========================================================= */
(function(){
  if(typeof document==="undefined") return;
  var TOKEN_KEY = localStorage.getItem("authToken") ? "authToken" : "token";
  function getTok(){ return localStorage.getItem("authToken")||localStorage.getItem("token"); }
  if(!getTok()) return; // not logged in

  function initBell(){
    // find header container to attach bell
    var dashboardUserArea = document.querySelector(".dashboard-user-area");
    var topbar = document.querySelector(".main .topbar");
    var header = dashboardUserArea || (topbar ? topbar : null);
    if(!header) return;
    if(document.querySelector(".notification-bell-wrap")) return;

    var wrap = document.createElement("div");
    wrap.className = "notification-bell-wrap";
    wrap.innerHTML = '<button type="button" class="notification-bell-btn" aria-label="Notifications"><i class="fa-solid fa-bell"></i><span class="notification-badge hidden" id="notificationBadge"></span></button>'+
      '<div class="notification-dropdown" id="notificationDropdown">'+
      '<div class="notification-dropdown-header"><strong><i class="fa-solid fa-bell"></i> Notifications</strong><span style="font-size:12px;color:#999" id="notificationUnreadLabel"></span></div>'+
      '<div class="notification-dropdown-list" id="notificationList"><div class="notification-empty">Loading...</div></div>'+
      '<div class="notification-dropdown-footer"><button type="button" id="markAllReadBtn">Mark all as read</button></div></div>';

    if(dashboardUserArea){
      dashboardUserArea.insertBefore(wrap, dashboardUserArea.firstChild);
    } else if(topbar){
      // topbar has h1 on left and logout on right; insert before logout
      var logoutBtn = topbar.querySelector(".logout");
      if(logoutBtn) topbar.insertBefore(wrap, logoutBtn);
      else topbar.appendChild(wrap);
      topbar.style.flexWrap="wrap";
    }

    var btn = wrap.querySelector(".notification-bell-btn");
    var dropdown = document.getElementById("notificationDropdown");
    var badge = document.getElementById("notificationBadge");
    var listEl = document.getElementById("notificationList");

    function iconForType(t){
      if(t==="review") return "fa-star";
      if(t==="enquiry") return "fa-envelope";
      if(t==="newsletter") return "fa-envelope-open-text";
      if(t==="booking") return "fa-calendar-check";
      if(t==="order") return "fa-cart-shopping";
      if(t==="visitor_milestone") return "fa-trophy";
      return "fa-bell";
    }
    function timeAgo(d){
      var s=Math.floor((Date.now()-new Date(d).getTime())/1000);
      if(s<60) return "just now";
      if(s<3600) return Math.floor(s/60)+"m ago";
      if(s<86400) return Math.floor(s/3600)+"h ago";
      if(s<604800) return Math.floor(s/86400)+"d ago";
      return new Date(d).toLocaleDateString();
    }
    async function fetchCount(){
      try{
        var r=await fetch("/api/notifications/unread-count",{headers:{Authorization:"Bearer "+getTok()}});
        if(!r.ok) return;
        var d=await r.json();
        var c=d.count||0;
        if(c>0){ badge.textContent=c>99?"99+":String(c); badge.classList.remove("hidden"); document.getElementById("notificationUnreadLabel").textContent=c+" unread"; }
        else { badge.textContent=""; badge.classList.add("hidden"); document.getElementById("notificationUnreadLabel").textContent=""; }
      }catch(_){}
    }
    async function fetchList(){
      try{
        var r=await fetch("/api/notifications?limit=10",{headers:{Authorization:"Bearer "+getTok()}});
        if(!r.ok) return;
        var arr=await r.json();
        if(!Array.isArray(arr) || !arr.length){ listEl.innerHTML='<div class="notification-empty">No notifications</div>'; return; }
        listEl.innerHTML=arr.map(function(n){
          return '<div class="notification-item '+(n.read?"":"unread")+'" data-id="'+n.id+'" data-link="'+escapeHtml(n.link||"")+'">'+
            '<div class="notification-item-icon"><i class="fa-solid '+iconForType(n.type)+'"></i></div>'+
            '<div class="notification-item-body"><strong>'+escapeHtml(n.title)+'</strong><span>'+escapeHtml(n.message)+'</span><div class="notification-item-time">'+timeAgo(n.createdAt)+'</div></div></div>';
        }).join("");
        listEl.querySelectorAll(".notification-item").forEach(function(el){
          el.addEventListener("click", async function(){
            var id=el.getAttribute("data-id");
            var link=el.getAttribute("data-link");
            try{ await fetch("/api/notifications/"+id+"/read",{method:"PATCH",headers:{Authorization:"Bearer "+getTok()}});}catch(_){}
            fetchCount();
            el.classList.remove("unread");
            if(link) window.location.href=link;
          });
        });
      }catch(_){}
    }
    btn.addEventListener("click", function(e){
      e.stopPropagation();
      var isOpen=dropdown.classList.contains("open");
      if(isOpen) dropdown.classList.remove("open");
      else { dropdown.classList.add("open"); fetchList(); }
    });
    document.addEventListener("click", function(e){
      if(!wrap.contains(e.target)) dropdown.classList.remove("open");
    });
    var markBtn=document.getElementById("markAllReadBtn");
    if(markBtn) markBtn.addEventListener("click", async function(e){
      e.stopPropagation();
      try{ await fetch("/api/notifications/read-all",{method:"PATCH",headers:{Authorization:"Bearer "+getTok()}});}catch(_){}
      fetchCount(); fetchList();
    });
    fetchCount(); fetchList();
    setInterval(function(){ fetchCount(); if(dropdown.classList.contains("open")) fetchList(); }, 20000);
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", initBell);
  else initBell();
})();