/* =====================================================
   FUZION CAFE ADMIN
   TEAM MANAGEMENT
   UploadThing Version
===================================================== */

let editingId = null;

const API_URL = "/api/team";


/* =====================================================
   UPLOADTHING
===================================================== */

import {
    genUploader
} from "https://cdn.jsdelivr.net/npm/uploadthing@7.7.4/client/+esm";


const {
    uploadFiles
} = genUploader({
    url: "/api/uploadthing"
});


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
    message,
    type = "success"
) {

    const element =
        document.getElementById(
            "message"
        );

    if (!element) {
        return;
    }

    element.style.display =
        "block";

    element.textContent =
        message;


    if (type === "error") {

        element.style.background =
            "#f8d7da";

        element.style.color =
            "#842029";

    } else {

        element.style.background =
            "#dff3e4";

        element.style.color =
            "#245b32";
    }
}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {

    return String(
        value ?? ""
    ).replace(
        /[&<>"']/g,
        character => {

            const map = {

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            };

            return map[
                character
            ];

        }
    );
}


/* =====================================================
   AUTH TOKEN
===================================================== */

function getToken() {

    return localStorage.getItem(
        "token"
    );
}


/* =====================================================
   CHECK LOGIN
===================================================== */

function checkLogin() {

    const token =
        getToken();

    if (!token) {

        window.location.href =
            "/login.html";

        return false;
    }

    return true;
}


/* =====================================================
   AUTH HEADERS
===================================================== */

function getAuthHeaders() {

    const token =
        getToken();

    return {

        Authorization:
            `Bearer ${token}`

    };
}


/* =====================================================
   UPLOAD IMAGE TO UPLOADTHING
===================================================== */

async function uploadTeamImage(
    file
) {

    if (!file) {

        throw new Error(
            "Please select a team image."
        );
    }


    const token =
        getToken();


    if (!token) {

        throw new Error(
            "You are not logged in."
        );
    }


    console.log(
        "Uploading team image to UploadThing..."
    );


    const result =
        await uploadFiles(

            "teamImage",

            {

                files: [file],

                headers: {

                    Authorization:
                        `Bearer ${token}`

                }

            }

        );


    console.log(
        "Team UploadThing result:",
        result
    );


    if (
        !result ||
        !result.length
    ) {

        throw new Error(
            "UploadThing did not return an uploaded image."
        );
    }


    const uploadedFile =
        result[0];


    const imageUrl =
        uploadedFile.ufsUrl ||
        uploadedFile.url;


    if (!imageUrl) {

        throw new Error(
            "UploadThing image URL not found."
        );
    }


    console.log(
        "Team image URL:",
        imageUrl
    );


    return imageUrl;
}


/* =====================================================
   LOAD ALL TEAM MEMBERS
===================================================== */

async function loadTeamMembers() {

    const tbody =
        document.getElementById(
            "teamTableBody"
        );


    if (!tbody) {
        return;
    }


    if (!checkLogin()) {
        return;
    }


    try {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty"
                >
                    Loading...
                </td>

            </tr>

        `;


        const response =
            await fetch(
                `${API_URL}/all`,
                {
                    method: "GET",

                    headers:
                        getAuthHeaders()
                }
            );


        const data =
            await response.json();


        if (
            response.status === 401 ||
            response.status === 403
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
                "Failed to load team members"
            );
        }


        const members =
            Array.isArray(
                data.team
            )
                ? data.team
                : [];


        if (!members.length) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        class="empty"
                    >
                        No team members found.
                    </td>

                </tr>

            `;

            return;
        }


        tbody.innerHTML =
            members
                .map(
                    member => {

                        const imageUrl =
                            member.image ||
                            "";


                        return `

                            <tr>

                                <td>
                                    ${escapeHtml(
                                        member.id
                                    )}
                                </td>


                                <td>
                                    ${escapeHtml(
                                        member.name ||
                                        ""
                                    )}
                                </td>


                                <td>
                                    ${escapeHtml(
                                        member.position ||
                                        ""
                                    )}
                                </td>


                                <td>

                                    ${
                                        imageUrl

                                            ? `

                                                <img
                                                    src="${escapeHtml(
                                                        imageUrl
                                                    )}"
                                                    alt="${escapeHtml(
                                                        member.name ||
                                                        "Team Member"
                                                    )}"
                                                    style="
                                                        width:70px;
                                                        height:70px;
                                                        object-fit:cover;
                                                        border-radius:8px;
                                                        display:block;
                                                    "
                                                    onerror="
                                                        this.style.display='none';
                                                    "
                                                >

                                            `

                                            : "-"
                                    }

                                </td>


                                <td>
                                    ${escapeHtml(
                                        member.status ||
                                        "Active"
                                    )}
                                </td>


                                <td>

                                    <div class="actions">

                                        <button
                                            type="button"
                                            class="btn secondary"
                                            data-edit-id="${Number(
                                                member.id
                                            )}"
                                        >
                                            Edit
                                        </button>


                                        <button
                                            type="button"
                                            class="btn danger"
                                            data-delete-id="${Number(
                                                member.id
                                            )}"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        `;

                    }
                )
                .join("");


        /* =============================================
           EDIT BUTTONS
        ============================================= */

        document
            .querySelectorAll(
                "[data-edit-id]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            editTeamMember(
                                Number(
                                    button.dataset.editId
                                )
                            );

                        }
                    );

                }
            );


        /* =============================================
           DELETE BUTTONS
        ============================================= */

        document
            .querySelectorAll(
                "[data-delete-id]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            deleteTeamMember(
                                Number(
                                    button.dataset.deleteId
                                )
                            );

                        }
                    );

                }
            );


    } catch (error) {

        console.error(
            "LOAD TEAM ERROR:",
            error
        );


        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty"
                >
                    Failed to load team members.
                </td>

            </tr>

        `;


        showMessage(
            error.message ||
            "Failed to load team members",
            "error"
        );
    }
}


/* =====================================================
   SAVE / CREATE / UPDATE
===================================================== */

async function saveTeamMember(
    event
) {

    event.preventDefault();


    if (!checkLogin()) {
        return;
    }


    const nameInput =
        document.getElementById(
            "name"
        );

    const positionInput =
        document.getElementById(
            "position"
        );

    const statusInput =
        document.getElementById(
            "status"
        );

    const imageInput =
        document.getElementById(
            "image"
        );


    if (
        !nameInput ||
        !positionInput ||
        !statusInput ||
        !imageInput
    ) {

        showMessage(
            "Team form fields are missing.",
            "error"
        );

        return;
    }


    const name =
        nameInput.value.trim();

    const position =
        positionInput.value.trim();

    const status =
        statusInput.value ||
        "Active";


    /* =============================================
       VALIDATION
    ============================================= */

    if (!name) {

        showMessage(
            "Name is required.",
            "error"
        );

        nameInput.focus();

        return;
    }


    if (!position) {

        showMessage(
            "Position is required.",
            "error"
        );

        positionInput.focus();

        return;
    }


    const file =
        imageInput.files &&
        imageInput.files.length
            ? imageInput.files[0]
            : null;


    /* CREATE requires image */

    if (!editingId && !file) {

        showMessage(
            "Please select a team image.",
            "error"
        );

        imageInput.focus();

        return;
    }


    /* =============================================
       IMAGE VALIDATION
    ============================================= */

    if (file) {

        const allowedTypes = [

            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"

        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            showMessage(
                "Only JPG, JPEG, PNG and WEBP images are allowed.",
                "error"
            );

            imageInput.value = "";

            return;
        }


        const maxSize =
            5 * 1024 * 1024;


        if (
            file.size > maxSize
        ) {

            showMessage(
                "Image size must be less than 5 MB.",
                "error"
            );

            imageInput.value = "";

            return;
        }
    }


    const wasEditing =
        Boolean(editingId);


    const saveButton =
        document.getElementById(
            "saveButton"
        );


    try {

        if (saveButton) {

            saveButton.disabled =
                true;

            saveButton.textContent =
                wasEditing
                    ? "Uploading..."
                    : "Uploading...";
        }


        /* =========================================
           UPLOAD NEW IMAGE
        ========================================= */

        let imageUrl = "";


        if (file) {

            imageUrl =
                await uploadTeamImage(
                    file
                );

        }


        /* =========================================
           PREPARE JSON
        ========================================= */

        const payload = {

            name,

            position,

            status

        };


        /*
         * New image selected:
         * send UploadThing URL.
         *
         * Editing without new image:
         * backend keeps old URL.
         */

        if (imageUrl) {

            payload.image =
                imageUrl;

        }


        /* =========================================
           REQUEST
        ========================================= */

        const url =
            editingId
                ? `${API_URL}/${editingId}`
                : API_URL;


        const method =
            editingId
                ? "PUT"
                : "POST";


        if (saveButton) {

            saveButton.textContent =
                wasEditing
                    ? "Updating..."
                    : "Saving...";
        }


        const response =
            await fetch(
                url,
                {

                    method,

                    headers: {

                        ...getAuthHeaders(),

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            payload
                        )

                }
            );


        let result = {};

        try {

            result =
                await response.json();

        } catch {
            result = {};
        }


        if (
            response.status === 401 ||
            response.status === 403
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
                result.message ||
                `Failed to ${
                    wasEditing
                        ? "update"
                        : "add"
                } team member`
            );
        }


        /* =========================================
           SUCCESS
        ========================================= */

        showMessage(
            result.message ||
            (
                wasEditing
                    ? "Team member updated successfully."
                    : "Team member added successfully."
            ),
            "success"
        );


        resetTeamForm();


        await loadTeamMembers();


    } catch (error) {

        console.error(
            "SAVE TEAM ERROR:",
            error
        );


        showMessage(
            error.message ||
            "Something went wrong while saving the team member.",
            "error"
        );


    } finally {

        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.textContent =
                editingId
                    ? "Update"
                    : "Save";
        }
    }
}


/* =====================================================
   EDIT TEAM MEMBER
===================================================== */

async function editTeamMember(
    id
) {

    if (!checkLogin()) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "GET",
                    headers:
                        getAuthHeaders()
                }
            );


        /*
         * Public single-member endpoint
         * is not currently in routes.
         *
         * So use /all for compatibility.
         */

        let member = null;


        if (response.ok) {

            const data =
                await response.json();

            member =
                data.team ||
                data;

        }


        if (!member) {

            const allResponse =
                await fetch(
                    `${API_URL}/all`,
                    {
                        headers:
                            getAuthHeaders()
                    }
                );


            const allData =
                await allResponse.json();


            const members =
                Array.isArray(
                    allData.team
                )
                    ? allData.team
                    : [];


            member =
                members.find(
                    item =>
                        Number(item.id) ===
                        Number(id)
                );
        }


        if (!member) {

            throw new Error(
                "Team member not found."
            );
        }


        editingId =
            member.id;


        const nameInput =
            document.getElementById(
                "name"
            );

        const positionInput =
            document.getElementById(
                "position"
            );

        const statusInput =
            document.getElementById(
                "status"
            );

        const imageInput =
            document.getElementById(
                "image"
            );


        if (nameInput) {

            nameInput.value =
                member.name || "";
        }


        if (positionInput) {

            positionInput.value =
                member.position || "";
        }


        if (statusInput) {

            statusInput.value =
                member.status ||
                "Active";
        }


        if (imageInput) {

            imageInput.value =
                "";
        }


        const formTitle =
            document.getElementById(
                "formTitle"
            );


        if (formTitle) {

            formTitle.textContent =
                "Edit Team Member";
        }


        const saveButton =
            document.getElementById(
                "saveButton"
            );


        if (saveButton) {

            saveButton.textContent =
                "Update";
        }


        showMessage(
            "Editing team member. Choose a new image only if you want to replace the current image.",
            "success"
        );


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });


    } catch (error) {

        console.error(
            "EDIT TEAM ERROR:",
            error
        );


        showMessage(
            error.message ||
            "Failed to edit team member.",
            "error"
        );
    }
}


/* =====================================================
   DELETE TEAM MEMBER
===================================================== */

async function deleteTeamMember(
    id
) {

    if (!checkLogin()) {
        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this team member?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {

                    method: "DELETE",

                    headers:
                        getAuthHeaders()

                }
            );


        let result = {};

        try {

            result =
                await response.json();

        } catch {

            result = {};

        }


        if (
            response.status === 401 ||
            response.status === 403
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
                result.message ||
                "Failed to delete team member"
            );
        }


        showMessage(
            result.message ||
            "Team member deleted successfully.",
            "success"
        );


        await loadTeamMembers();


    } catch (error) {

        console.error(
            "DELETE TEAM ERROR:",
            error
        );


        showMessage(
            error.message ||
            "Failed to delete team member.",
            "error"
        );
    }
}


/* =====================================================
   RESET FORM
===================================================== */

function resetTeamForm() {

    editingId = null;


    const form =
        document.getElementById(
            "teamForm"
        );


    if (form) {
        form.reset();
    }


    const formTitle =
        document.getElementById(
            "formTitle"
        );


    if (formTitle) {

        formTitle.textContent =
            "Add Team Member";
    }


    const saveButton =
        document.getElementById(
            "saveButton"
        );


    if (saveButton) {

        saveButton.textContent =
            "Save";
    }


    const imageInput =
        document.getElementById(
            "image"
        );


    if (imageInput) {

        imageInput.value =
            "";
    }
}


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const teamForm =
            document.getElementById(
                "teamForm"
            );


        if (teamForm) {

            teamForm.addEventListener(
                "submit",
                saveTeamMember
            );
        }


        loadTeamMembers();
    }
);


/* =====================================================
   GLOBAL FUNCTIONS
   Needed by existing HTML buttons
===================================================== */

window.loadTeamMembers =
    loadTeamMembers;

window.saveTeamMember =
    saveTeamMember;

window.editTeamMember =
    editTeamMember;

window.deleteTeamMember =
    deleteTeamMember;

window.resetTeamForm =
    resetTeamForm;