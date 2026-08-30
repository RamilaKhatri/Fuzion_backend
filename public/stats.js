/* =========================================================
   FUZION CAFE - STATISTICS ADMIN
========================================================= */

const API = "/api";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const statsForm = document.getElementById("statsForm");
const statId = document.getElementById("statId");
const iconInput = document.getElementById("icon");
const targetValueInput = document.getElementById("targetValue");
const suffixInput = document.getElementById("suffix");
const labelInput = document.getElementById("label");
const orderInput = document.getElementById("order");
const isActiveInput = document.getElementById("isActive");

const tableBody = document.getElementById("statsTableBody");
const messageBox = document.getElementById("message");
const formTitle = document.getElementById("formTitle");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");


/* =========================================================
   CHECK REQUIRED ELEMENTS
========================================================= */

if (
    !statsForm ||
    !statId ||
    !iconInput ||
    !targetValueInput ||
    !suffixInput ||
    !labelInput ||
    !orderInput ||
    !isActiveInput ||
    !tableBody ||
    !messageBox ||
    !formTitle ||
    !saveBtn ||
    !cancelBtn
) {
    console.error(
        "Statistics Admin: One or more required HTML elements are missing."
    );
}


/* =========================================================
   DEFAULT ICONS
========================================================= */

const STAT_ICON_MAP = {
    "Years Experience": "fa-solid fa-calendar-days",
    "Expert Chefs": "fa-solid fa-user-tie",
    "Menu Items": "fa-solid fa-utensils",
    "Happy Customers": "fa-solid fa-users"
};


/* =========================================================
   AUTO SELECT ICON WHEN LABEL CHANGES
========================================================= */

if (labelInput && iconInput) {

    labelInput.addEventListener("input", () => {

        const selectedLabel =
            labelInput.value.trim();

        const matchedLabel =
            Object.keys(STAT_ICON_MAP).find(
                label =>
                    label.toLowerCase() ===
                    selectedLabel.toLowerCase()
            );

        if (matchedLabel) {

            iconInput.value =
                STAT_ICON_MAP[matchedLabel];

        }

    });

}


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


/* =========================================================
   CHECK LOGIN
========================================================= */

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
   HANDLE UNAUTHORIZED
========================================================= */

function handleUnauthorized() {

    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    window.location.href =
        "/login.html";

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

    if (!messageBox) {
        return;
    }

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
   GET ALL STATISTICS
========================================================= */

async function getStats() {

    const response =
        await fetch(
            `${API}/stats/admin`,
            {
                method: "GET",
                headers:
                    getAuthHeaders()
            }
        );


    const data =
        await response.json();


    if (response.status === 401) {

        handleUnauthorized();

        return [];

    }


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to load statistics."
        );

    }


    return Array.isArray(data)
        ? data
        : data.data || [];

}


/* =========================================================
   LOAD ALL STATS
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

        const stats =
            await getStats();

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
            error.message ||
            "Failed to load statistics.",
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
            stat.isActive === true ||
            stat.isActive === 1 ||
            stat.isActive === "true";


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

                        <i
                            class="${escapeHtml(stat.icon)}"
                            aria-hidden="true"
                        ></i>

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
                        type="button"
                        class="btn"
                        data-edit="${escapeHtml(stat.id)}"
                    >

                        <i
                            class="fa-solid fa-pen"
                            aria-hidden="true"
                        ></i>

                        Edit

                    </button>


                    <button
                        type="button"
                        class="btn secondary"
                        data-delete="${escapeHtml(stat.id)}"
                    >

                        <i
                            class="fa-solid fa-trash"
                            aria-hidden="true"
                        ></i>

                        Delete

                    </button>

                </div>

            </td>

        `;


        tableBody.appendChild(tr);

    });


    /* =====================================================
       EDIT BUTTONS
    ===================================================== */

    tableBody
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


    /* =====================================================
       DELETE BUTTONS
    ===================================================== */

    tableBody
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
   CREATE / UPDATE STATISTIC
========================================================= */

if (statsForm) {

    statsForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!checkLogin()) {
                return;
            }


            const id =
                statId.value.trim();


            const label =
                labelInput.value.trim();


            const icon =
                iconInput.value.trim();


            const targetValue =
                Number(
                    targetValueInput.value
                );


            const suffix =
                suffixInput.value.trim() || "+";


            const order =
                Number(
                    orderInput.value
                ) || 0;


            const isActive =
                isActiveInput.value === "true";


            /* ==========================================
               VALIDATION
            ========================================== */

            if (!label) {

                showMessage(
                    "Please enter a statistic label.",
                    "error"
                );

                labelInput.focus();

                return;

            }


            if (!icon) {

                showMessage(
                    "Please enter an icon.",
                    "error"
                );

                iconInput.focus();

                return;

            }


            if (
                !Number.isFinite(targetValue) ||
                targetValue < 0
            ) {

                showMessage(
                    "Please enter a valid target value.",
                    "error"
                );

                targetValueInput.focus();

                return;

            }


            if (
                !Number.isFinite(order) ||
                order < 0
            ) {

                showMessage(
                    "Please enter a valid order.",
                    "error"
                );

                orderInput.focus();

                return;

            }


            try {

                saveBtn.disabled = true;

                saveBtn.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Saving...
                `;


                /* ==========================================
                   GET EXISTING STATISTICS
                ========================================== */

                const existingStats =
                    await getStats();


                /* ==========================================
                   CHECK DUPLICATE LABEL
                ========================================== */

                const duplicate =
                    existingStats.find(
                        stat => {

                            const sameLabel =
                                String(
                                    stat.label || ""
                                )
                                    .trim()
                                    .toLowerCase() ===
                                label.toLowerCase();


                            const differentId =
                                String(stat.id) !==
                                String(id);


                            return (
                                sameLabel &&
                                differentId
                            );

                        }
                    );


                if (duplicate) {

                    showMessage(
                        `"${label}" already exists. Please use a different label.`,
                        "error"
                    );

                    return;

                }


                /* ==========================================
                   PAYLOAD
                ========================================== */

                const payload = {

                    icon:
                        icon,

                    targetValue:
                        targetValue,

                    suffix:
                        suffix,

                    label:
                        label,

                    order:
                        order,

                    isActive:
                        isActive

                };


                /* ==========================================
                   URL + METHOD
                ========================================== */

                const url =
                    id
                        ? `${API}/stats/admin/${encodeURIComponent(id)}`
                        : `${API}/stats/admin`;


                const method =
                    id
                        ? "PUT"
                        : "POST";


                /* ==========================================
                   SAVE
                ========================================== */

                const response =
                    await fetch(
                        url,
                        {
                            method:
                                method,

                            headers:
                                getAuthHeaders(),

                            body:
                                JSON.stringify(
                                    payload
                                )
                        }
                    );


                const data =
                    await response.json();


                /* ==========================================
                   TOKEN EXPIRED
                ========================================== */

                if (
                    response.status === 401
                ) {

                    handleUnauthorized();

                    return;

                }


                /* ==========================================
                   ERROR
                ========================================== */

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to save statistic."
                    );

                }


                /* ==========================================
                   SUCCESS
                ========================================== */

                showMessage(
                    id
                        ? "Statistic updated successfully."
                        : "Statistic created successfully."
                );


                resetForm();

                await loadStats();


            } catch (error) {

                console.error(
                    "Save stat error:",
                    error
                );


                showMessage(
                    error.message ||
                    "Failed to save statistic.",
                    "error"
                );


            } finally {

                saveBtn.disabled =
                    false;

                if (!statId.value) {

                    saveBtn.innerHTML = `
                        <i class="fa-solid fa-floppy-disk"></i>
                        Save Statistics
                    `;

                } else {

                    saveBtn.innerHTML = `
                        <i class="fa-solid fa-floppy-disk"></i>
                        Update Statistics
                    `;

                }

            }

        }
    );

}


/* =========================================================
   EDIT STAT
========================================================= */

async function editStat(id) {

    if (!checkLogin()) {
        return;
    }


    try {

        const stats =
            await getStats();


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


        /* ==========================================
           FILL FORM
        ========================================== */

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
            (
                stat.isActive === true ||
                stat.isActive === 1 ||
                stat.isActive === "true"
            )
                ? "true"
                : "false";


        /* ==========================================
           CHANGE FORM UI
        ========================================== */

        formTitle.textContent =
            "Edit Statistics";


        saveBtn.innerHTML = `
            <i class="fa-solid fa-floppy-disk"></i>
            Update Statistics
        `;


        cancelBtn.style.display =
            "inline-flex";


        /* ==========================================
           SCROLL TO FORM
        ========================================== */

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
            error.message ||
            "Failed to edit statistic.",
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
                `${API}/stats/admin/${encodeURIComponent(id)}`,
                {
                    method:
                        "DELETE",

                    headers:
                        getAuthHeaders()
                }
            );


        const data =
            await response.json();


        /* ==========================================
           TOKEN EXPIRED
        ========================================== */

        if (
            response.status === 401
        ) {

            handleUnauthorized();

            return;

        }


        /* ==========================================
           ERROR
        ========================================== */

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to delete statistic."
            );

        }


        /* ==========================================
           SUCCESS
        ========================================== */

        showMessage(
            "Statistic deleted successfully."
        );


        await loadStats();


    } catch (error) {

        console.error(
            "Delete stat error:",
            error
        );


        showMessage(
            error.message ||
            "Failed to delete statistic.",
            "error"
        );

    }

}


/* =========================================================
   RESET FORM
========================================================= */

function resetForm() {

    if (!statsForm) {
        return;
    }


    statsForm.reset();


    statId.value =
        "";


    suffixInput.value =
        "+";


    orderInput.value =
        "0";


    isActiveInput.value =
        "true";


    formTitle.textContent =
        "Add Statistics";


    saveBtn.innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        Save Statistics
    `;


    cancelBtn.style.display =
        "none";

}


/* =========================================================
   CANCEL EDIT
========================================================= */

if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        function () {

            resetForm();

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


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
