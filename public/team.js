/* =====================================================
   FUZION CAFE ADMIN
   TEAM MANAGEMENT
===================================================== */

let editingId = null;

const API_URL = "/api/team";


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(message, type = "success") {

    const element = document.getElementById("message");

    if (!element) {
        return;
    }

    element.style.display = "block";
    element.textContent = message;

    if (type === "error") {

        element.style.background = "#f8d7da";
        element.style.color = "#842029";

    } else {

        element.style.background = "#dff3e4";
        element.style.color = "#245b32";

    }
}


/* =====================================================
   LOAD ALL TEAM MEMBERS
===================================================== */

async function loadTeamMembers() {

    const tbody =
        document.getElementById("teamTableBody");

    if (!tbody) {
        return;
    }

    try {

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    Loading...
                </td>
            </tr>
        `;


        const response =
            await fetch(`${API_URL}/all`);


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load team members"
            );

        }


        const members =
            Array.isArray(data.team)
                ? data.team
                : [];


        if (!members.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty">
                        No team members found.
                    </td>
                </tr>
            `;

            return;
        }


        tbody.innerHTML =
            members.map(member => {

                let imageUrl =
                    member.image || "";


                /*
                 * Convert relative image path
                 * into full backend URL.
                 *
                 * Example:
                 * /uploads/team/team-123.jpg
                 *
                 * becomes:
                 * http://localhost:5000/uploads/team/team-123.jpg
                 */

                if (
                    imageUrl &&
                    !imageUrl.startsWith("http://") &&
                    !imageUrl.startsWith("https://")
                ) {

                    if (imageUrl.startsWith("/")) {

                        imageUrl =
                            window.location.origin +
                            imageUrl;

                    } else {

                        imageUrl =
                            window.location.origin +
                            "/" +
                            imageUrl;

                    }

                }


                return `

                    <tr>

                        <td>
                            ${escapeHtml(member.id)}
                        </td>


                        <td>
                            ${escapeHtml(
                                member.name || ""
                            )}
                        </td>


                        <td>
                            ${escapeHtml(
                                member.position || ""
                            )}
                        </td>


                        <td>

                            ${
                                imageUrl
                                    ? `
                                        <img
                                            src="${escapeHtml(imageUrl)}"
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
                                            onerror="this.style.display='none';"
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
                                    onclick="editTeamMember(${Number(member.id)})"
                                >
                                    Edit
                                </button>


                                <button
                                    type="button"
                                    class="btn danger"
                                    onclick="deleteTeamMember(${Number(member.id)})"
                                >
                                    Delete
                                </button>

                            </div>

                        </td>

                    </tr>

                `;

            }).join("");


    } catch (error) {

        console.error(
            "LOAD TEAM ERROR:",
            error
        );


        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
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
   SAVE / CREATE / UPDATE TEAM MEMBER
===================================================== */

async function saveTeamMember(event) {

    event.preventDefault();


    try {

        const nameInput =
            document.getElementById("name");

        const positionInput =
            document.getElementById("position");

        const statusInput =
            document.getElementById("status");

        const imageInput =
            document.getElementById("image");


        if (
            !nameInput ||
            !positionInput ||
            !statusInput ||
            !imageInput
        ) {

            throw new Error(
                "Team form fields are missing."
            );

        }


        const name =
            nameInput.value.trim();

        const position =
            positionInput.value.trim();

        const status =
            statusInput.value || "Active";


        /* ==========================================
           VALIDATION
        ========================================== */

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


        /*
         * For CREATE:
         * image is required.
         *
         * For UPDATE:
         * image is optional because the existing
         * image will remain if no new image is selected.
         */

        if (
            !editingId &&
            (
                !imageInput.files ||
                imageInput.files.length === 0
            )
        ) {

            showMessage(
                "Please select a team image.",
                "error"
            );

            imageInput.focus();

            return;
        }


        /* ==========================================
           CHECK IMAGE TYPE
        ========================================== */

        if (
            imageInput.files &&
            imageInput.files.length > 0
        ) {

            const file =
                imageInput.files[0];


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


            /*
             * Backend limit:
             * 5 MB
             */

            const maxSize =
                5 * 1024 * 1024;


            if (file.size > maxSize) {

                showMessage(
                    "Image size must be less than 5 MB.",
                    "error"
                );

                imageInput.value = "";

                return;
            }

        }


        /* ==========================================
           REMEMBER WHETHER THIS IS UPDATE
        ========================================== */

        const wasEditing =
            Boolean(editingId);


        /* ==========================================
           CREATE FORMDATA
        ========================================== */

        const formData =
            new FormData();


        formData.append(
            "name",
            name
        );


        formData.append(
            "position",
            position
        );


        formData.append(
            "status",
            status
        );


        /*
         * Add image only when selected.
         *
         * IMPORTANT:
         * Do NOT manually add Content-Type.
         */

        if (
            imageInput.files &&
            imageInput.files.length > 0
        ) {

            formData.append(
                "image",
                imageInput.files[0]
            );

        }


        /* ==========================================
           URL
        ========================================== */

        const url =
            editingId
                ? `${API_URL}/${editingId}`
                : API_URL;


        /* ==========================================
           METHOD
        ========================================== */

        const method =
            editingId
                ? "PUT"
                : "POST";


        /* ==========================================
           DISABLE SAVE BUTTON
        ========================================== */

        const saveButton =
            document.getElementById(
                "saveButton"
            );


        if (saveButton) {

            saveButton.disabled = true;

            saveButton.textContent =
                wasEditing
                    ? "Updating..."
                    : "Saving...";

        }


        /* ==========================================
           SEND REQUEST
        ========================================== */

        const response =
            await fetch(
                url,
                {
                    method: method,
                    body: formData
                }
            );


        /*
         * Try to read JSON response.
         */

        let result = {};

        try {

            result =
                await response.json();

        } catch {

            result = {};

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


        /* ==========================================
           RESET FORM
        ========================================== */

        resetTeamForm();


        /* ==========================================
           SUCCESS MESSAGE
        ========================================== */

        showMessage(
            result.message ||
            (
                wasEditing
                    ? "Team member updated successfully."
                    : "Team member added successfully."
            )
        );


        /* ==========================================
           RELOAD TABLE
        ========================================== */

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

        /*
         * Enable save button again.
         */

        const saveButton =
            document.getElementById(
                "saveButton"
            );


        if (saveButton) {

            saveButton.disabled = false;

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

async function editTeamMember(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/all`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load team members"
            );

        }


        const members =
            Array.isArray(data.team)
                ? data.team
                : [];


        const member =
            members.find(
                item =>
                    Number(item.id) ===
                    Number(id)
            );


        if (!member) {

            showMessage(
                "Team member not found.",
                "error"
            );

            return;
        }


        /* ==========================================
           SET EDITING ID
        ========================================== */

        editingId =
            member.id;


        /* ==========================================
           FILL FORM
        ========================================== */

        const nameInput =
            document.getElementById("name");

        const positionInput =
            document.getElementById("position");

        const statusInput =
            document.getElementById("status");

        const imageInput =
            document.getElementById("image");


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
                member.status || "Active";

        }


        /*
         * Browser does not allow us to
         * put an existing image into a
         * file input.
         *
         * So leave it empty.
         *
         * Backend will keep the old image
         * if no new image is uploaded.
         */

        if (imageInput) {

            imageInput.value = "";

        }


        /* ==========================================
           CHANGE FORM TITLE
        ========================================== */

        const formTitle =
            document.getElementById(
                "formTitle"
            );


        if (formTitle) {

            formTitle.textContent =
                "Edit Team Member";

        }


        /* ==========================================
           CHANGE SAVE BUTTON
        ========================================== */

        const saveButton =
            document.getElementById(
                "saveButton"
            );


        if (saveButton) {

            saveButton.textContent =
                "Update";

        }


        /* ==========================================
           SCROLL TO FORM
        ========================================== */

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });


        showMessage(
            "Editing team member. Select a new image only if you want to replace the existing image."
        );


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

async function deleteTeamMember(id) {

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
                    method: "DELETE"
                }
            );


        let result = {};

        try {

            result =
                await response.json();

        } catch {

            result = {};

        }


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to delete team member"
            );

        }


        showMessage(
            result.message ||
            "Team member deleted successfully."
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

        imageInput.value = "";

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


            return map[character];

        }
    );

}


/* =====================================================
   FORM SUBMIT
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


        /*
         * Load team members when page
         * is ready.
         */

        loadTeamMembers();

    }
);


/* =====================================================
   MAKE FUNCTIONS AVAILABLE TO HTML
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