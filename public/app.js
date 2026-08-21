// ===============================
// FUZION CAFE ADMIN DASHBOARD
// ===============================

// Get stored token
const token = localStorage.getItem("token");

// If no token, go back to login
if (!token) {
  window.location.href = "login.html";
}


// ===============================
// LOAD DASHBOARD DATA
// ===============================

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

    if (!response.ok) {
      throw new Error(data.message || "Failed to load dashboard");
    }


    // ===============================
    // UPDATE STATISTICS
    // ===============================

    document.getElementById("users").textContent =
      data.statistics.totalUsers;

    document.getElementById("projects").textContent =
      data.statistics.totalProjects;

    document.getElementById("enquiries").textContent =
      data.statistics.totalEnquiries;

    document.getElementById("bookings").textContent =
      data.statistics.totalBookings;


  } catch (error) {

    console.error("Dashboard Error:", error);

    const errorElement = document.getElementById("error");

    if (errorElement) {
      errorElement.textContent = error.message;
    }

  }
}


// ===============================
// NAVIGATION
// ===============================

function goToProjects() {
  window.location.href = "projects.html";
}


function goToBookings() {
  alert("Bookings page coming next!");
}


function goToEnquiries() {
  alert("Enquiries page coming next!");
}


function goToProfile() {
  window.location.href = "login.html";
}


// ===============================
// LOGOUT
// ===============================

const logoutButton = document.getElementById("logout");

if (logoutButton) {

  logoutButton.addEventListener("click", () => {

    localStorage.removeItem("token");

    window.location.href = "login.html";

  });

}


// ===============================
// START DASHBOARD
// ===============================

loadDashboard();