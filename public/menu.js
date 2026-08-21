// ==========================================
// FUZION CAFE - MENU MANAGEMENT
// ==========================================

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

const API_URL = "/api/menu";

const menuItemsContainer = document.getElementById("menuItems");
const messageElement = document.getElementById("message");
const formTitle = document.getElementById("formTitle");
const cancelButton = document.getElementById("cancelBtn");
const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("imagePreview");

let editingId = null;
let currentImage = null;

// ==========================================
// IMAGE PREVIEW
// ==========================================

if (imageInput) {
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    imagePreview.innerHTML = "";

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showMessage("Image is too large. Maximum size is 5MB.", "error");
      imageInput.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const img = document.createElement("img");
    img.src = previewUrl;
    img.alt = "Selected menu image preview";
    img.onload = () => URL.revokeObjectURL(previewUrl);
    imagePreview.appendChild(img);
  });
}

// ==========================================
// LOAD MENU ITEMS
// ==========================================

async function loadMenuItems() {
  try {
    menuItemsContainer.innerHTML = `<p class="loading">Loading menu...</p>`;

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load menu");
    }

    displayMenuItems(data);
  } catch (error) {
    console.error("Menu Error:", error);
    menuItemsContainer.innerHTML = `<p class="error-message">${escapeHTML(error.message)}</p>`;
  }
}

// ==========================================
// DISPLAY MENU ITEMS
// ==========================================

function displayMenuItems(items) {
  menuItemsContainer.innerHTML = "";

  if (!items || items.length === 0) {
    menuItemsContainer.innerHTML = `
      <div class="empty-menu">
        <div class="empty-icon">☕</div>
        <h3>No Menu Items Yet</h3>
        <p>Add your first food or drink item above.</p>
      </div>
    `;
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "menu-card";

    let icon = "☕";
    const category = String(item.category || "").toLowerCase();
    if (category.includes("chicken") || category.includes("food")) icon = "🍽️";
    else if (category.includes("tea") || category.includes("coffee")) icon = "🍵";
    else if (category.includes("dessert")) icon = "🍰";
    else if (category.includes("drink")) icon = "🥤";

    const availabilityClass = item.available ? "available" : "unavailable";
    const availabilityText = item.available ? "● Available" : "● Unavailable";
    const availabilityButtonText = item.available ? "🔴 Disable" : "🟢 Enable";

    const imageBlock = item.image
      ? `
        <div class="menu-card-top has-image">
          <img class="menu-card-image" src="${escapeAttribute(item.image)}" alt="${escapeAttribute(item.name)}" onerror="this.style.display='none'">
        </div>
      `
      : `
        <div class="menu-card-top">${icon}</div>
      `;

    card.innerHTML = `
      ${imageBlock}
      <div class="menu-card-content">
        <span class="menu-category">${escapeHTML(item.category)}</span>
        <h3>${escapeHTML(item.name)}</h3>
        <p>${item.description ? escapeHTML(item.description) : "No description available."}</p>
        <div class="menu-price">Rs. ${Number(item.price).toFixed(0)}</div>
        <div class="${availabilityClass}">${availabilityText}</div>
        ${item.image ? `<div class="menu-image-note">Image uploaded ✓</div>` : `<div class="menu-image-note">No uploaded image</div>`}
        <div class="menu-actions">
          <button class="edit-btn" onclick="editMenuItem(${item.id})">✏️ Edit</button>
          <button class="disable-btn" onclick="toggleAvailability(${item.id}, ${item.available})">${availabilityButtonText}</button>
          <button class="delete-btn" onclick="deleteMenuItem(${item.id})">🗑️ Delete</button>
        </div>
      </div>
    `;

    menuItemsContainer.appendChild(card);
  });
}

// ==========================================
// SAVE MENU ITEM WITH IMAGE
// ==========================================

async function saveMenuItem() {
  clearMessages();

  const name =
    document.getElementById("name").value.trim();

  const category =
    document.getElementById("category").value.trim();

  const price =
    document.getElementById("price").value;

  const description =
    document.getElementById("description").value.trim();

  const available =
    document.getElementById("available").value === "true";

  const file =
    imageInput.files[0];

  // ------------------------------------------
  // VALIDATION
  // ------------------------------------------

  if (!name || !category || price === "") {
    showMessage(
      "Please fill in name, category and price.",
      "error"
    );
    return;
  }

  if (Number(price) < 0) {
    showMessage(
      "Price cannot be negative.",
      "error"
    );
    return;
  }

  if (file && file.size > 5 * 1024 * 1024) {
    showMessage(
      "Image is too large. Maximum size is 5MB.",
      "error"
    );
    return;
  }

  try {
    // ------------------------------------------
    // IMAGE
    // ------------------------------------------

    let imageUrl = currentImage || null;

    /*
      If a new image is selected,
      upload it to UploadThing first.
    */

    if (file) {
      showMessage(
        "Uploading image...",
        "success"
      );

      if (
        typeof window.uploadMenuImage !==
        "function"
      ) {
        throw new Error(
          "Menu UploadThing uploader is not loaded."
        );
      }

      imageUrl =
        await window.uploadMenuImage(file);
    }

    // ------------------------------------------
    // MENU DATA
    // ------------------------------------------

    const menuData = {
      name,
      category,
      price: Number(price),
      description,
      available,
      image: imageUrl
    };

    // ------------------------------------------
    // SAVE TO BACKEND
    // ------------------------------------------

    const response = await fetch(
      editingId
        ? `${API_URL}/${editingId}`
        : API_URL,
      {
        method: editingId
          ? "PUT"
          : "POST",

        headers: {
          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(menuData)
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Something went wrong"
      );
    }

    // ------------------------------------------
    // SUCCESS
    // ------------------------------------------

    showMessage(
      editingId
        ? "Menu item updated successfully! ✅"
        : "Menu item added successfully! ✅",
      "success"
    );

    resetForm();

    await loadMenuItems();

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
    const response = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const item = await response.json();

    if (!response.ok) {
      throw new Error(item.message || "Menu item not found");
    }

    document.getElementById("name").value = item.name;
    document.getElementById("category").value = item.category;
    document.getElementById("price").value = item.price;
    document.getElementById("description").value = item.description || "";
    document.getElementById("available").value = item.available ? "true" : "false";

    editingId = id;
    currentImage = item.image || null;

    imageInput.value = "";
    imagePreview.innerHTML = item.image
      ? `<img src="${escapeAttribute(item.image)}" alt="Current menu image" onerror="this.style.display='none'"><small class="muted">Current image. Choose another image above to replace it.</small>`
      : `<small class="muted">No image uploaded yet. Choose an image to add one.</small>`;

    formTitle.textContent = "Edit Menu Item";
    cancelButton.style.display = "inline-block";

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    console.error("Edit Error:", error);
    showMessage(error.message, "error");
  }
}

// ==========================================
// RESET FORM
// ==========================================

function resetForm() {
  document.getElementById("name").value = "";
  document.getElementById("category").value = "";
  document.getElementById("price").value = "";
  document.getElementById("description").value = "";
  document.getElementById("available").value = "true";
  imageInput.value = "";
  imagePreview.innerHTML = "";

  editingId = null;
  currentImage = null;
  formTitle.textContent = "Add Menu Item";
  cancelButton.style.display = "none";
}

// ==========================================
// TOGGLE AVAILABILITY
// ==========================================

async function toggleAvailability(id, currentStatus) {
  try {
    const response = await fetch(`${API_URL}/${id}/availability`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ available: !currentStatus }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update availability");
    }

    showMessage("Availability updated successfully! ✅", "success");
    loadMenuItems();
  } catch (error) {
    console.error("Availability Error:", error);
    showMessage(error.message, "error");
  }
}

// ==========================================
// DELETE MENU ITEM
// ==========================================

async function deleteMenuItem(id) {
  if (!confirm("Are you sure you want to delete this menu item?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete menu item");
    }

    showMessage("Menu item deleted successfully! 🗑️", "success");
    loadMenuItems();
  } catch (error) {
    console.error("Delete Error:", error);
    showMessage(error.message, "error");
  }
}

function showMessage(message, type) {
  messageElement.textContent = message;
  messageElement.className = `message ${type}`;

  setTimeout(() => {
    messageElement.textContent = "";
    messageElement.className = "message";
  }, 3500);
}

function clearMessages() {
  messageElement.textContent = "";
  messageElement.className = "message";
}

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

function escapeAttribute(value) {
  return escapeHTML(value)
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

loadMenuItems();
