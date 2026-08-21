// ==========================================
// FUZION CAFE MENU MANAGEMENT
// ==========================================


// ==========================================
// GET ADMIN TOKEN
// ==========================================

const token = localStorage.getItem("token");


// If no token, go to login
if (!token) {

    window.location.href = "login.html";

}


// ==========================================
// EDITING ITEM ID
// ==========================================

let editingId = null;



// ==========================================
// LOAD MENU ITEMS
// ==========================================

async function loadMenuItems() {

    try {

        const response = await fetch(
            "/api/menu",
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"
                }
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load menu"
            );

        }


        displayMenuItems(data);


    } catch (error) {

        console.error(
            "Menu Error:",
            error
        );


        document.getElementById(
            "menuItems"
        ).innerHTML = `
            <p>
                Failed to load menu.
            </p>
        `;

    }

}



// ==========================================
// DISPLAY MENU ITEMS
// ==========================================

function displayMenuItems(menuItems) {

    const container =
        document.getElementById(
            "menuItems"
        );


    if (!menuItems.length) {

        container.innerHTML = `
            
            <div class="empty-menu">

                <h3>
                    ☕ No Menu Items Yet
                </h3>

                <p>
                    Add your first cafe item
                    using the form above.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        menuItems.map(item => `

            <div
                class="menu-card"
            >

                <div
                    class="menu-card-icon"
                >
                    ☕
                </div>


                <div
                    class="menu-card-content"
                >

                    <span
                        class="category"
                    >
                        ${item.category}
                    </span>


                    <h3>
                        ${item.name}
                    </h3>


                    <p>
                        ${
                            item.description ||
                            "No description"
                        }
                    </p>


                    <strong
                        class="price"
                    >
                        Rs. ${item.price}
                    </strong>


                    <div
                        class="availability"
                    >

                        ${
                            item.available

                            ? `
                                <span
                                    class="available"
                                >
                                    ● Available
                                </span>
                              `

                            : `
                                <span
                                    class="unavailable"
                                >
                                    ● Unavailable
                                </span>
                              `
                        }

                    </div>


                    <div
                        class="menu-actions"
                    >

                        <button
                            onclick="editMenuItem(${item.id})"
                        >
                            ✏️ Edit
                        </button>


                        <button
                            onclick="toggleAvailability(
                                ${item.id},
                                ${item.available}
                            )"
                        >
                            ${
                                item.available
                                ? "🔴 Disable"
                                : "🟢 Enable"
                            }
                        </button>


                        <button
                            onclick="deleteMenuItem(${item.id})"
                        >
                            🗑️ Delete
                        </button>

                    </div>

                </div>

            </div>

        `).join("");

}



// ==========================================
// SAVE MENU ITEM
// CREATE / UPDATE
// ==========================================

async function saveMenuItem() {

    const name =
        document.getElementById(
            "name"
        ).value.trim();


    const category =
        document.getElementById(
            "category"
        ).value;


    const price =
        document.getElementById(
            "price"
        ).value;


    const description =
        document.getElementById(
            "description"
        ).value.trim();


    const available =
        document.getElementById(
            "available"
        ).value === "true";


    // Validation

    if (
        !name ||
        !category ||
        price === ""
    ) {

        showMessage(
            "Please fill all required fields.",
            "error"
        );

        return;

    }


    const menuData = {

        name,
        category,
        price: Number(price),
        description,
        available

    };


    try {

        let response;


        // ======================================
        // UPDATE
        // ======================================

        if (editingId) {

            response = await fetch(
                `/api/menu/${editingId}`,
                {
                    method: "PUT",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(menuData)

                }
            );

        }


        // ======================================
        // CREATE
        // ======================================

        else {

            response = await fetch(
                "/api/menu",
                {
                    method: "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(menuData)

                }
            );

        }


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Something went wrong"
            );

        }


        showMessage(
            data.message ||
            "Menu saved successfully!",
            "success"
        );


        // Reset form

        clearForm();


        // Reload menu

        loadMenuItems();


    } catch (error) {

        console.error(
            "Save Menu Error:",
            error
        );


        showMessage(
            error.message,
            "error"
        );

    }

}



// ==========================================
// EDIT MENU ITEM
// ==========================================

async function editMenuItem(id) {

    try {

        const response =
            await fetch(
                `/api/menu/${id}`,
                {
                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"

                    }
                }
            );


        const item =
            await response.json();


        if (!response.ok) {

            throw new Error(
                item.message ||
                "Menu item not found"
            );

        }


        // Fill form

        document.getElementById(
            "name"
        ).value = item.name;


        document.getElementById(
            "category"
        ).value = item.category;


        document.getElementById(
            "price"
        ).value = item.price;


        document.getElementById(
            "description"
        ).value =
            item.description || "";


        document.getElementById(
            "available"
        ).value =
            item.available
            ? "true"
            : "false";


        // Set editing ID

        editingId = id;


        // Change title

        document.getElementById(
            "formTitle"
        ).textContent =
            "Edit Menu Item";


        // Show cancel

        document.getElementById(
            "cancelBtn"
        ).style.display =
            "inline-block";


        // Scroll to form

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        alert(error.message);

    }

}



// ==========================================
// DELETE MENU ITEM
// ==========================================

async function deleteMenuItem(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this menu item?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/menu/${id}`,
                {
                    method: "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to delete menu item"
            );

        }


        showMessage(
            "Menu Item Deleted Successfully",
            "success"
        );


        loadMenuItems();


    } catch (error) {

        alert(error.message);

    }

}



// ==========================================
// TOGGLE AVAILABILITY
// ==========================================

async function toggleAvailability(
    id,
    currentStatus
) {

    try {

        const response =
            await fetch(
                `/api/menu/${id}/availability`,
                {
                    method: "PATCH",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        available:
                            !currentStatus

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to update availability"
            );

        }


        loadMenuItems();


    } catch (error) {

        alert(error.message);

    }

}



// ==========================================
// CANCEL EDIT
// ==========================================

function cancelEdit() {

    clearForm();

}



// ==========================================
// CLEAR FORM
// ==========================================

function clearForm() {

    document.getElementById(
        "name"
    ).value = "";


    document.getElementById(
        "category"
    ).value = "";


    document.getElementById(
        "price"
    ).value = "";


    document.getElementById(
        "description"
    ).value = "";


    document.getElementById(
        "available"
    ).value = "true";


    editingId = null;


    document.getElementById(
        "formTitle"
    ).textContent =
        "Add Menu Item";


    document.getElementById(
        "cancelBtn"
    ).style.display =
        "none";

}



// ==========================================
// SHOW MESSAGE
// ==========================================

function showMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "message"
        );


    element.textContent =
        message;


    element.className =
        type;


    setTimeout(() => {

        element.textContent = "";

        element.className = "";

    }, 3000);

}



// ==========================================
// NAVIGATION
// ==========================================

function goToBookings() {

    alert(
        "Bookings page coming next!"
    );

}


function goToEnquiries() {

    alert(
        "Enquiries page coming next!"
    );

}


function goToProfile() {

    alert(
        "Admin Profile coming next!"
    );

}



// ==========================================
// LOGOUT
// ==========================================

const logoutButton =
    document.getElementById(
        "logout"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "token"
            );

            window.location.href =
                "login.html";

        }
    );

}



// ==========================================
// START
// ==========================================

loadMenuItems();