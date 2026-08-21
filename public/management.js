const moduleName = window.MODULE;
let editingId = null;

// Store loaded records safely for editing
const recordsById = new Map();

/* =========================================================
   MODULE CONFIGURATION
========================================================= */

const configs = {

    /* ================= PROJECTS ================= */

    projects: {
        endpoint: "/api/projects",

        columns: [
            "ID",
            "Title",
            "Description",
            "Status",
            "Actions"
        ],

        fields: [
            ["title", "Title", "text", true],
            ["description", "Description", "textarea", true],
            [
                "status",
                "Status",
                "select",
                true,
                ["Pending", "In Progress", "Completed"]
            ]
        ],

        row: r => [
            r.id,
            escapeHtml(r.title),
            escapeHtml(r.description),
            escapeHtml(r.status)
        ],

        formData: () => ({
            title: v("title"),
            description: v("description"),
            status: v("status")
        })
    },


    /* ================= USERS ================= */

    users: {
        endpoint: "/api/users",

        columns: [
            "ID",
            "Name",
            "Email",
            "Role",
            "Status",
            "Actions"
        ],

        fields: [
            ["name", "Name", "text", true],
            ["email", "Email", "email", true],
            ["password", "New Password", "password", false],

            [
                "role",
                "Role",
                "select",
                true,
                ["user", "admin"]
            ],

            [
                "status",
                "Status",
                "select",
                true,
                ["active", "inactive"]
            ]
        ],

        row: r => [
            r.id,
            escapeHtml(r.name),
            escapeHtml(r.email),
            escapeHtml(r.role),
            escapeHtml(r.status)
        ],

        formData: () => ({
            name: v("name"),
            email: v("email"),
            password: v("password"),
            role: v("role"),
            status: v("status")
        })
    },


    /* ================= BOOKINGS ================= */

    bookings: {
        endpoint: "/api/bookings",

        columns: [
            "ID",
            "Customer",
            "Contact",
            "Date",
            "Time",
            "Guests",
            "Status",
            "Actions"
        ],

        fields: [
            ["name", "Name", "text", true],
            ["email", "Email", "email", true],
            ["phone", "Phone", "text", true],
            ["date", "Date", "date", false],
            ["time", "Time", "time", false],
            ["guests", "Guests", "number", false],
            ["service", "Service", "text", false],
            ["message", "Message", "textarea", false],

            [
                "status",
                "Status",
                "select",
                true,
                [
                    "Pending",
                    "Approved",
                    "Rejected",
                    "Completed",
                    "Cancelled"
                ]
            ]
        ],

        row: r => [
            r.id,
            escapeHtml(r.name),
            `${escapeHtml(r.email || "-")}<br>${escapeHtml(r.phone || "-")}`,
            escapeHtml(r.date || "-"),
            escapeHtml(r.time || "-"),
            r.guests || "-",
            escapeHtml(r.status)
        ],

        formData: () => ({
            name: v("name"),
            email: v("email"),
            phone: v("phone"),
            date: v("date") || null,
            time: v("time") || null,
            guests: v("guests")
                ? Number(v("guests"))
                : null,
            service: v("service"),
            message: v("message"),
            status: v("status")
        })
    },


    /* ================= ENQUIRIES ================= */

    enquiries: {
        endpoint: "/api/enquiries",

        columns: [
            "ID",
            "Name",
            "Email",
            "Subject",
            "Message",
            "Status",
            "Actions"
        ],

        fields: [
            ["name", "Name", "text", true],
            ["email", "Email", "email", true],
            ["subject", "Subject", "text", false],
            ["message", "Message", "textarea", true],

            [
                "status",
                "Status",
                "select",
                true,
                [
                    "Pending",
                    "Read",
                    "Resolved",
                    "Rejected"
                ]
            ]
        ],

        row: r => [
            r.id,
            escapeHtml(r.name),
            escapeHtml(r.email),
            escapeHtml(r.subject || "-"),
            escapeHtml(r.message),
            escapeHtml(r.status)
        ],

        formData: () => ({
            name: v("name"),
            email: v("email"),
            subject: v("subject"),
            message: v("message"),
            status: v("status")
        })
    },


    /* ================= ORDERS ================= */

    orders: {
        endpoint: "/api/orders",

        columns: [
            "ID",
            "Customer",
            "Phone",
            "Items",
            "Total",
            "Status",
            "Actions"
        ],

        fields: [
            ["customerName", "Customer Name", "text", true],
            ["phone", "Phone", "text", true],
            ["items", "Items", "textarea", true],
            ["totalAmount", "Total Amount", "number", true],

            [
                "status",
                "Status",
                "select",
                true,
                [
                    "Pending",
                    "Preparing",
                    "Completed",
                    "Cancelled"
                ]
            ]
        ],

        row: r => [
            r.id,
            escapeHtml(r.customerName),
            escapeHtml(r.phone),
            escapeHtml(r.items),
            r.totalAmount,
            escapeHtml(r.status)
        ],

        formData: () => ({
            customerName: v("customerName"),
            phone: v("phone"),
            items: v("items"),
            totalAmount: Number(v("totalAmount")),
            status: v("status")
        })
    },


     /* ================= NEWSLETTER ================= */

newsletter: {

    endpoint: "/api/newsletter",

    columns: [
        "ID",
        "Email",
        "Subscribed At",
        "Actions"
    ],

    fields: [],

    row: r => [
        r.id,
        escapeHtml(r.email),
        r.createdAt
            ? new Date(r.createdAt).toLocaleString()
            : "-"
    ],

    formData: () => ({})
},


    /* =====================================================
       GALLERY
       IMPORTANT:
       Backend Gallery model has:
       image
       alt
       category

       It DOES NOT have:
       title
       description
       status
    ===================================================== */

 /* ================= GALLERY ================= */

gallery: {

    endpoint: "/api/gallery",

    columns: [
        "ID",
        "Title",
        "Image",
        "Category",
        "Description",
        "Status",
        "Actions"
    ],

    fields: [

        ["title", "Title", "text", true],

        /*
         * IMPORTANT:
         * Gallery image is handled separately
         * using FormData in save()
         */
        [
            "imageFile",
            "Upload Image",
            "file",
            false
        ],

        [
            "category",
            "Category",
            "select",
            true,
            [
                "food",
                "drinks",
                "events",
                "ambiance",
                "customer-memory",
                "behind-scenes"
            ]
        ],

        [
            "description",
            "Description",
            "textarea",
            false
        ],

        [
            "status",
            "Status",
            "select",
            true,
            [
                "Active",
                "Inactive"
            ]
        ]

    ],

    row: r => [

        r.id,

        escapeHtml(
            r.title || "-"
        ),

        r.imageUrl

            ? `
                <img
                    src="${escapeHtml(r.imageUrl)}"
                    alt="${escapeHtml(
                        r.title || "Gallery Image"
                    )}"
                    style="
                        width:80px;
                        height:55px;
                        object-fit:cover;
                        border-radius:6px;
                    "
                    onerror="this.style.display='none'"
                >
              `

            : "-",

        escapeHtml(
            r.category || "-"
        ),

        escapeHtml(
            r.description || "-"
        ),

        escapeHtml(
            r.status || "Active"
        )

    ],

    /*
     * Gallery is uploaded with FormData,
     * so this is not used for imageFile.
     */

    formData: () => ({

        title:
            v("title"),

        category:
            v("category"),

        description:
            v("description"),

        status:
            v("status")

    })

}
}

/* =========================================================
   BASIC CHECK
========================================================= */

const cfg = configs[moduleName];

if (!cfg) {

    console.error("Unknown module:", moduleName);

    setTimeout(() => {
        setMessage(
            "Invalid module configuration",
            "error"
        );
    }, 100);
}


/* =========================================================
   SINGULAR NAME
========================================================= */

const singularName = {

    users: "User",
    bookings: "Booking",
    enquiries: "Enquiry",
    orders: "Order",
    gallery: "Gallery",
    projects: "Project",
    newsletter: "Newsletter Subscriber"

}[moduleName] || moduleName;


/* =========================================================
   GET INPUT VALUE
========================================================= */

function v(id) {

    const element = document.getElementById(id);

    if (!element) {
        return "";
    }

    return element.value;
}


/* =========================================================
   MESSAGE
========================================================= */

function setMessage(text, type = "success") {

    const el = document.getElementById("message");

    if (!el) {
        return;
    }

    el.style.display = "block";
    el.textContent = text;

    if (type === "error") {

        el.style.background = "#f8d7da";
        el.style.color = "#842029";

    } else {

        el.style.background = "#dff3e4";
        el.style.color = "#245b32";
    }
}


/* =========================================================
   ESCAPE HTML
========================================================= */

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


/* =========================================================
   BUILD FORM
========================================================= */

function buildForm() {

    const form = document.getElementById("manageForm");

    if (!form || !cfg) {
        return;
    }

    form.innerHTML = cfg.fields.map(
        ([id, label, type, required, options]) => {

            let control = "";

            /* TEXTAREA */

            if (type === "textarea") {

                control = `
                    <textarea
                        id="${id}"
                        ${required ? "required" : ""}
                    ></textarea>
                `;

            }

            /* SELECT */

            else if (type === "select") {

                control = `
                    <select
                        id="${id}"
                        ${required ? "required" : ""}
                    >

                        ${options.map(
                            option => `
                                <option value="${option}">
                                    ${option}
                                </option>
                            `
                        ).join("")}

                    </select>
                `;

            }

            /* INPUT */

           else {

    control = `
        <input
            id="${id}"
            type="${type}"
            ${required ? "required" : ""}
            ${type === "file"
                ? 'accept="image/jpeg,image/png,image/webp,image/gif"'
                : ""}
        >
    `;
}

            return `
                <div class="field ${type === "textarea" ? "full" : ""}">

                    <label>
                        ${label}${required ? " *" : ""}
                    </label>

                    ${control}

                </div>
            `;
        }
    ).join("") + `

        <div class="actions full">

            <button
                class="btn primary"
                type="submit"
                id="saveButton"
            >
                Save
            </button>

            <button
                class="btn secondary"
                type="button"
                onclick="resetForm()"
            >
                Clear
            </button>

        </div>
    `;

    form.onsubmit = save;
}


/* =========================================================
   FILL EDIT FORM
========================================================= */

function fillForm(item) {

    editingId = item.id;

    /*
     * Gallery backend returns:
     * url
     *
     * But form uses:
     * image
     *
     * So convert url -> image
     */

    if (moduleName === "gallery") {

        item = {
            ...item,
            image: item.image || item.url || ""
        };
    }


    cfg.fields.forEach(([id]) => {

        const element = document.getElementById(id);

        if (!element) {
            return;
        }

        element.value = item[id] ?? "";
    });


    /* Password should always be empty while editing */

    if (moduleName === "users") {

        const password =
            document.getElementById("password");

        if (password) {
            password.value = "";
        }
    }


    const title =
        document.getElementById("formTitle");

    if (title) {

        title.textContent =
            `Edit ${singularName}`;
    }


    const saveButton =
        document.getElementById("saveButton");

    if (saveButton) {

        saveButton.textContent =
            "Update";
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   RESET FORM
========================================================= */

function resetForm() {

    editingId = null;

    const form =
        document.getElementById("manageForm");

    if (form) {
        form.reset();
    }


    const title =
        document.getElementById("formTitle");

    if (title) {

        title.textContent =
            `Add ${singularName}`;
    }


    const saveButton =
        document.getElementById("saveButton");

    if (saveButton) {

        saveButton.textContent =
            "Save";
    }
}


/* =========================================================
   LOAD DATA
========================================================= */

async function loadData() {

    if (!cfg) {
        return;
    }

    const tbody =
        document.getElementById("tbody");

    const thead =
        document.getElementById("thead");

    try {

        if (tbody) {

            tbody.innerHTML = `
                <tr>
                    <td
                        colspan="${cfg.columns.length}"
                        class="empty"
                    >
                        Loading...
                    </td>
                </tr>
            `;
        }


        const data =
            await api(cfg.endpoint);


        /* ==============================================
           FIND ARRAY FROM BACKEND RESPONSE
        ============================================== */

        let rows = [];


        if (Array.isArray(data)) {

            rows = data;

        }

        else if (Array.isArray(data.items)) {

            rows = data.items;

        }

        else if (Array.isArray(data.users)) {

            rows = data.users;

        }

        else if (Array.isArray(data.bookings)) {

            rows = data.bookings;

        }

        else if (Array.isArray(data.enquiries)) {

            rows = data.enquiries;

        }

        else if (Array.isArray(data.orders)) {

            rows = data.orders;

        }

         else if (Array.isArray(data.subscribers)) {

    rows = data.subscribers;

}


        else if (Array.isArray(data.projects)) {

            rows = data.projects;

        }

        /*
         * IMPORTANT:
         * Gallery backend returns:
         *
         * {
         *   images: [...]
         * }
         */

        else if (Array.isArray(data.images)) {

            rows = data.images;

        }

        else if (Array.isArray(data.gallery)) {

            rows = data.gallery;
        }


        /* Clear previous records */

        recordsById.clear();


        /* Store records */

        rows.forEach(row => {

            recordsById.set(
                String(row.id),
                row
            );
        });


        /* ==============================================
           TABLE HEADER
        ============================================== */

        if (thead) {

            thead.innerHTML = `
                <tr>

                    ${cfg.columns.map(
                        column =>
                            `<th>${column}</th>`
                    ).join("")}

                </tr>
            `;
        }


        /* ==============================================
           NO DATA
        ============================================== */

        if (!rows.length) {

            if (tbody) {

                tbody.innerHTML = `
                    <tr>
                        <td
                            colspan="${cfg.columns.length}"
                            class="empty"
                        >
                            No records found.
                        </td>
                    </tr>
                `;
            }

            return;
        }


        /* ==============================================
           CREATE TABLE ROWS
        ============================================== */

        if (tbody) {

            tbody.innerHTML = rows.map(row => {

                const cells =
                    cfg.row(row)
                        .map(
                            value =>
                                `<td>${value ?? "-"}</td>`
                        )
                        .join("");


                /* Edit button */

                let actionButtons = `

                    <button
                        class="btn secondary"
                        onclick="editRecord(${row.id})"
                    >
                        Edit
                    </button>

                `;


                /* Booking approve */

                if (moduleName === "bookings") {

                    actionButtons += `

                        <button
                            class="btn success"
                            onclick="approveRecord(${row.id})"
                        >
                            Approve
                        </button>

                    `;
                }


                /* Enquiry resolve */

                if (
                    moduleName === "enquiries" &&
                    row.status !== "Resolved"
                ) {

                    actionButtons += `

                        <button
                            class="btn success"
                            onclick="resolveRecord(${row.id})"
                        >
                            Resolve
                        </button>

                    `;
                }


                /* Delete */

                actionButtons += `

                    <button
                        class="btn danger"
                        onclick="deleteRecord(${row.id})"
                    >
                        Delete
                    </button>

                `;


                return `

                    <tr>

                        ${cells}

                        <td>

                            <div class="actions">

                                ${actionButtons}

                            </div>

                        </td>

                    </tr>

                `;

            }).join("");
        }


    } catch (error) {

        console.error(
            "LOAD DATA ERROR:",
            error
        );


        if (tbody) {

            tbody.innerHTML = `
                <tr>
                    <td
                        colspan="${cfg.columns.length}"
                        class="empty"
                    >
                        Failed to load data.
                    </td>
                </tr>
            `;
        }


        setMessage(
            error.message ||
            "Failed to load data",
            "error"
        );
    }
}


/* =========================================================
   EDIT RECORD
========================================================= */

function editRecord(id) {

    const item =
        recordsById.get(String(id));

    if (!item) {

        setMessage(
            "Record not found",
            "error"
        );

        return;
    }

    fillForm(item);
}


/* =========================================================
   SAVE / UPDATE
========================================================= */

async function save(event) {

    event.preventDefault();

    try {

        const data =
            cfg.formData();


        /* ==============================================
           USER PASSWORD
           Optional while editing
        ============================================== */

        if (
            moduleName === "users" &&
            !data.password
        ) {

            delete data.password;
        }


        /* ==============================================
           URL
        ============================================== */

        const url = editingId
            ? `${cfg.endpoint}/${editingId}`
            : cfg.endpoint;


        /* ==============================================
           METHOD
        ============================================== */

        const method = editingId
            ? "PUT"
            : "POST";


        /* ==============================================
           SEND TO BACKEND
        ============================================== */

        const result =
            await api(
                url,
                {
                    method: method,
                    body: JSON.stringify(data)
                }
            );


        setMessage(
            result.message ||
            "Saved successfully"
        );


        resetForm();

        await loadData();


    } catch (error) {

        console.error(
            "SAVE ERROR:",
            error
        );


        setMessage(
            error.message ||
            "Failed to save",
            "error"
        );
    }
}


/* =========================================================
   DELETE
========================================================= */

async function deleteRecord(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this record?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const result =
            await api(
                `${cfg.endpoint}/${id}`,
                {
                    method: "DELETE"
                }
            );


        setMessage(
            result.message ||
            "Deleted successfully"
        );


        await loadData();


    } catch (error) {

        console.error(
            "DELETE ERROR:",
            error
        );


        setMessage(
            error.message ||
            "Failed to delete",
            "error"
        );
    }
}


/* =========================================================
   UPDATE STATUS
========================================================= */

async function updateStatus(id, status) {

    try {

        let url;
        let method = "PATCH";


        /* BOOKINGS */

        if (moduleName === "bookings") {

            url =
                `${cfg.endpoint}/${id}/status`;
        }


        /* ORDERS */

        else if (moduleName === "orders") {

            url =
                `${cfg.endpoint}/${id}/status`;
        }


        /* ENQUIRIES */

        else if (moduleName === "enquiries") {

            url =
                `${cfg.endpoint}/${id}`;

            method = "PUT";
        }


        /* OTHER */

        else {

            url =
                `${cfg.endpoint}/${id}/status`;
        }


        const result =
            await api(
                url,
                {
                    method: method,
                    body: JSON.stringify({
                        status: status
                    })
                }
            );


        setMessage(
            result.message ||
            "Status updated successfully"
        );


        await loadData();


    } catch (error) {

        console.error(
            "UPDATE STATUS ERROR:",
            error
        );


        setMessage(
            error.message ||
            "Failed to update status",
            "error"
        );
    }
}


/* =========================================================
   BOOKING APPROVE
========================================================= */

async function approveRecord(id) {

    await updateStatus(
        id,
        "Approved"
    );
}


/* =========================================================
   ENQUIRY RESOLVE
========================================================= */

async function resolveRecord(id) {

    await updateStatus(
        id,
        "Resolved"
    );
}


/* =========================================================
   INITIALIZE
========================================================= */

buildForm();

loadData();