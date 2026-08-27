/* =========================================================
   FUZION CAFE - STATISTICS ADMIN
========================================================= */


const API = "/api";



/* =========================================================
   DOM ELEMENTS
========================================================= */

const statsForm =
    document.getElementById("statsForm");

const statId =
    document.getElementById("statId");

const iconInput =
    document.getElementById("icon");

const targetValueInput =
    document.getElementById("targetValue");

const suffixInput =
    document.getElementById("suffix");

const labelInput =
    document.getElementById("label");

const orderInput =
    document.getElementById("order");

const isActiveInput =
    document.getElementById("isActive");

const tableBody =
    document.getElementById("statsTableBody");

const messageBox =
    document.getElementById("message");

const formTitle =
    document.getElementById("formTitle");

const saveBtn =
    document.getElementById("saveBtn");

const cancelBtn =
    document.getElementById("cancelBtn");



/* =========================================================
   AUTH
========================================================= */

function getToken() {

    return localStorage.getItem("token");

}


function getAuthHeaders() {

    const token = getToken();

    return {

        "Content-Type": "application/json",

        "Authorization": `Bearer ${token}`

    };

}


function checkLogin() {

    const token = getToken();

    if (!token) {

        window.location.href =
            "/login.html";

        return false;

    }

    return true;

}



/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("admin");

    window.location.href =
        "/login.html";

}



/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    message,
    type = "success"
) {

    messageBox.textContent =
        message;

    messageBox.className =
        `message ${type}`;

    messageBox.style.display =
        "block";


    setTimeout(() => {

        messageBox.style.display =
            "none";

    }, 3500);

}



/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}



/* =========================================================
   LOAD ALL STATS
   GET /api/admin/stats
========================================================= */

async function loadStats() {

    if (!checkLogin()) {
        return;
    }


    tableBody.innerHTML = `

        <tr>

            <td
                colspan="9"
                class="empty"
            >
                Loading statistics...
            </td>

        </tr>

    `;


    try {

        const response =
            await fetch(
                `${API}/admin/stats`,
                {
                    method: "GET",
                    headers:
                        getAuthHeaders()
                }
            );


        const data =
            await response.json();


        /* TOKEN EXPIRED */

        if (
            response.status === 401
        ) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "admin"
            );

            window.location.href =
                "/login.html";

            return;

        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load statistics."
            );

        }


        const stats =
            Array.isArray(data)
                ? data
                : data.data || [];


        renderStats(stats);


    } catch (error) {

        console.error(
            "Stats load error:",
            error
        );


        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="empty"
                >
                    Failed to load statistics.
                </td>

            </tr>

        `;


        showMessage(
            error.message,
            "error"
        );

    }

}



/* =========================================================
   RENDER STATS
========================================================= */

function renderStats(stats) {

    tableBody.innerHTML = "";


    if (!stats.length) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="empty"
                >
                    No statistics found.
                </td>

            </tr>

        `;

        return;

    }


    stats.forEach(stat => {

        const tr =
            document.createElement("tr");


        const active =
            stat.isActive === true;


        tr.innerHTML = `

            <td>
                ${escapeHtml(stat.id)}
            </td>


            <td>

                <code>
                    ${escapeHtml(stat.icon)}
                </code>

            </td>


            <td>

                <div class="stat-preview">

                    <div class="stat-preview-icon">

                        <i class="${escapeHtml(stat.icon)}"></i>

                    </div>

                    <strong>

                        ${escapeHtml(stat.targetValue)}
                        ${escapeHtml(stat.suffix || "")}

                    </strong>

                </div>

            </td>


            <td>
                ${escapeHtml(stat.targetValue)}
            </td>


            <td>
                ${escapeHtml(stat.suffix || "")}
            </td>


            <td>
                ${escapeHtml(stat.label)}
            </td>


            <td>
                ${escapeHtml(stat.order)}
            </td>


            <td>

                ${
                    active

                    ? `
                        <span class="status active">
                            Active
                        </span>
                    `

                    : `
                        <span class="status inactive">
                            Inactive
                        </span>
                    `
                }

            </td>


            <td>

                <div class="action-buttons">

                    <button
                        class="btn"
                        data-edit="${stat.id}"
                    >
                        <i class="fa-solid fa-pen"></i>
                        Edit
                    </button>


                    <button
                        class="btn secondary"
                        data-delete="${stat.id}"
                    >
                        <i class="fa-solid fa-trash"></i>
                        Delete
                    </button>

                </div>

            </td>

        `;


        tableBody.appendChild(tr);

    });



    /* EDIT BUTTONS */

    document
        .querySelectorAll("[data-edit]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    editStat(
                        button.dataset.edit
                    );

                }
            );

        });



    /* DELETE BUTTONS */

    document
        .querySelectorAll("[data-delete]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteStat(
                        button.dataset.delete
                    );

                }
            );

        });

}



/* =========================================================
   CREATE / UPDATE
========================================================= */

statsForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (!checkLogin()) {
            return;
        }


        const id =
            statId.value.trim();


        const payload = {

            icon:
                iconInput.value.trim(),

            targetValue:
                Number(
                    targetValueInput.value
                ),

            suffix:
                suffixInput.value.trim() || "+",

            label:
                labelInput.value.trim(),

            order:
                Number(
                    orderInput.value
                ) || 0,

            isActive:
                isActiveInput.value === "true"

        };


        if (
            !payload.icon ||
            payload.targetValue === "" ||
            !payload.label
        ) {

            showMessage(
                "Please fill all required fields.",
                "error"
            );

            return;

        }


        try {

            saveBtn.disabled = true;


            const url =
                id
                    ? `${API}/admin/stats/${id}`
                    : `${API}/admin/stats`;


            const method =
                id
                    ? "PUT"
                    : "POST";


            const response =
                await fetch(
                    url,
                    {
                        method,
                        headers:
                            getAuthHeaders(),
                        body:
                            JSON.stringify(payload)
                    }
                );


            const data =
                await response.json();


            if (
                response.status === 401
            ) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "admin"
                );

                window.location.href =
                    "/login.html";

                return;

            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to save statistic."
                );

            }


            showMessage(

                id
                    ? "Statistic updated successfully."
                    : "Statistic created successfully."

            );


            resetForm();

            loadStats();


        } catch (error) {

            console.error(
                "Save stat error:",
                error
            );


            showMessage(
                error.message,
                "error"
            );


        } finally {

            saveBtn.disabled =
                false;

        }

    }
);



/* =========================================================
   EDIT STAT
========================================================= */

async function editStat(id) {

    if (!checkLogin()) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/admin/stats`,
                {
                    method: "GET",
                    headers:
                        getAuthHeaders()
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to fetch statistic."
            );

        }


        const stats =
            Array.isArray(data)
                ? data
                : data.data || [];


        const stat =
            stats.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!stat) {

            throw new Error(
                "Statistic not found."
            );

        }


        statId.value =
            stat.id;

        iconInput.value =
            stat.icon || "";

        targetValueInput.value =
            stat.targetValue ?? "";

        suffixInput.value =
            stat.suffix ?? "+";

        labelInput.value =
            stat.label || "";

        orderInput.value =
            stat.order ?? 0;

        isActiveInput.value =
            stat.isActive
                ? "true"
                : "false";


        formTitle.textContent =
            "Edit Statistics";

        saveBtn.innerHTML =
            `
            <i class="fa-solid fa-floppy-disk"></i>
            Update Statistics
            `;


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });


    } catch (error) {

        console.error(
            "Edit stat error:",
            error
        );


        showMessage(
            error.message,
            "error"
        );

    }

}



/* =========================================================
   DELETE STAT
========================================================= */

async function deleteStat(id) {

    if (!checkLogin()) {
        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this statistic?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/admin/stats/${id}`,
                {
                    method: "DELETE",
                    headers:
                        getAuthHeaders()
                }
            );


        const data =
            await response.json();


        if (
            response.status === 401
        ) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "admin"
            );

            window.location.href =
                "/login.html";

            return;

        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to delete statistic."
            );

        }


        showMessage(
            "Statistic deleted successfully."
        );


        loadStats();


    } catch (error) {

        console.error(
            "Delete stat error:",
            error
        );


        showMessage(
            error.message,
            "error"
        );

    }

}



/* =========================================================
   RESET FORM
========================================================= */

function resetForm() {

    statsForm.reset();

    statId.value = "";

    suffixInput.value =
        "+";

    orderInput.value =
        "0";

    isActiveInput.value =
        "true";


    formTitle.textContent =
        "Add Statistics";


    saveBtn.innerHTML =
        `
        <i class="fa-solid fa-floppy-disk"></i>
        Save Statistics
        `;

}



/* =========================================================
   CANCEL EDIT
========================================================= */

cancelBtn.addEventListener(
    "click",
    resetForm
);



/* =========================================================
   INITIAL LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (checkLogin()) {

            loadStats();

        }

    }
);