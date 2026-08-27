const API_BASE = "/api/admin/stats";

const statsForm = document.getElementById("statsForm");
const statsTableBody = document.getElementById("statsTableBody");
const logoutBtn = document.getElementById("logoutBtn");


// ==========================================
// GET TOKEN
// ==========================================

function getToken() {

    return (
        localStorage.getItem("token") ||
        localStorage.getItem("adminToken")
    );

}


// ==========================================
// API HEADERS
// ==========================================

function getHeaders() {

    const token = getToken();

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

}


// ==========================================
// LOAD ALL STATS
// ==========================================

async function loadStats() {

    try {

        const response = await fetch(API_BASE, {
            method: "GET",
            headers: getHeaders()
        });


        if (response.status === 401 || response.status === 403) {

            alert("Admin access required.");

            window.location.href = "login.html";

            return;
        }


        const result = await response.json();


        if (!result.success) {

            throw new Error(
                result.message || "Failed to load statistics."
            );

        }


        renderStats(result.data);

    }

    catch (error) {

        console.error("Load stats error:", error);

        statsTableBody.innerHTML = `
            <tr>
                <td colspan="8">
                    Failed to load statistics.
                </td>
            </tr>
        `;

    }

}


// ==========================================
// RENDER STATS
// ==========================================

function renderStats(stats) {

    statsTableBody.innerHTML = "";


    if (!stats || stats.length === 0) {

        statsTableBody.innerHTML = `
            <tr>
                <td colspan="8">
                    No statistics found.
                </td>
            </tr>
        `;

        return;
    }


    stats.forEach(stat => {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>
                ${stat.id}
            </td>


            <td>

                <i class="${escapeHtml(stat.icon)}"></i>

                <span style="margin-left:8px;">
                    ${escapeHtml(stat.icon)}
                </span>

            </td>


            <td>
                ${stat.targetValue}
            </td>


            <td>
                ${escapeHtml(stat.suffix || "")}
            </td>


            <td>
                ${escapeHtml(stat.label)}
            </td>


            <td>
                ${stat.order}
            </td>


            <td>

                <span class="status-badge ${
                    stat.isActive
                        ? "status-active"
                        : "status-inactive"
                }">

                    ${
                        stat.isActive
                            ? "Active"
                            : "Inactive"
                    }

                </span>

            </td>


            <td>

                <div class="table-actions">

                    <button
                        class="btn btn-small btn-edit"
                        onclick="editStat(${stat.id})"
                    >
                        <i class="fa-solid fa-pen"></i>
                        Edit
                    </button>


                    <button
                        class="btn btn-small btn-delete"
                        onclick="deleteStat(${stat.id})"
                    >
                        <i class="fa-solid fa-trash"></i>
                        Delete
                    </button>

                </div>

            </td>

        `;


        statsTableBody.appendChild(row);

    });

}


// ==========================================
// ADD STAT
// ==========================================

statsForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const icon =
        document.getElementById("icon").value.trim();

    const targetValue =
        Number(document.getElementById("targetValue").value);

    const suffix =
        document.getElementById("suffix").value.trim();

    const label =
        document.getElementById("label").value.trim();

    const order =
        Number(document.getElementById("order").value);

    const isActive =
        document.getElementById("isActive").value === "true";


    if (!icon || !label || Number.isNaN(targetValue)) {

        alert("Please fill all required fields.");

        return;
    }


    try {

        const response = await fetch(API_BASE, {

            method: "POST",

            headers: getHeaders(),

            body: JSON.stringify({

                icon,
                targetValue,
                suffix,
                label,
                order,
                isActive

            })

        });


        const result = await response.json();


        if (!response.ok) {

            throw new Error(
                result.message || "Failed to create statistic."
            );

        }


        alert("Statistic added successfully.");


        statsForm.reset();


        document.getElementById("suffix").value = "+";

        document.getElementById("order").value = "0";

        document.getElementById("isActive").value = "true";


        loadStats();

    }

    catch (error) {

        console.error("Create stat error:", error);

        alert(error.message);

    }

});


// ==========================================
// EDIT STAT
// ==========================================

async function editStat(id) {

    const icon =
        prompt("Enter Font Awesome icon class:");

    if (icon === null) return;


    const targetValue =
        prompt("Enter target value:");

    if (targetValue === null) return;


    const suffix =
        prompt("Enter suffix:", "+");

    if (suffix === null) return;


    const label =
        prompt("Enter label:");

    if (label === null) return;


    const order =
        prompt("Enter display order:", "0");

    if (order === null) return;


    const active =
        confirm(
            "Press OK for Active.\nPress Cancel for Inactive."
        );


    try {

        const response = await fetch(
            `${API_BASE}/${id}`,
            {

                method: "PUT",

                headers: getHeaders(),

                body: JSON.stringify({

                    icon: icon.trim(),

                    targetValue:
                        Number(targetValue),

                    suffix: suffix.trim(),

                    label: label.trim(),

                    order:
                        Number(order),

                    isActive:
                        active

                })

            }
        );


        const result = await response.json();


        if (!response.ok) {

            throw new Error(
                result.message || "Failed to update statistic."
            );

        }


        alert("Statistic updated successfully.");

        loadStats();

    }

    catch (error) {

        console.error("Update stat error:", error);

        alert(error.message);

    }

}


// ==========================================
// DELETE STAT
// ==========================================

async function deleteStat(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this statistic?"
    );


    if (!confirmed) return;


    try {

        const response = await fetch(
            `${API_BASE}/${id}`,
            {

                method: "DELETE",

                headers: getHeaders()

            }
        );


        const result = await response.json();


        if (!response.ok) {

            throw new Error(
                result.message || "Failed to delete statistic."
            );

        }


        alert("Statistic deleted successfully.");

        loadStats();

    }

    catch (error) {

        console.error("Delete stat error:", error);

        alert(error.message);

    }

}


// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("token");

        localStorage.removeItem("adminToken");

        window.location.href = "login.html";

    });

}


// ==========================================
// BASIC HTML ESCAPE
// ==========================================

function escapeHtml(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// ==========================================
// INITIAL LOAD
// ==========================================

loadStats();