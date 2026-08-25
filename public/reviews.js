/* =====================================================
   FUZION CAFE ADMIN
   CUSTOMER REVIEWS
===================================================== */

const API_URL = "/api/reviews";

let reviews = [];


/* =====================================================
   DOM ELEMENTS
===================================================== */

const reviewsContainer =
    document.getElementById("reviewsContainer");

const message =
    document.getElementById("message");

const totalReviews =
    document.getElementById("totalReviews");

const averageRating =
    document.getElementById("averageRating");

const repliedReviews =
    document.getElementById("repliedReviews");

const refreshBtn =
    document.getElementById("refreshBtn");


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(text, type = "success") {

    if (!message) {
        return;
    }

    message.textContent = text;

    message.className = `message ${type}`;
}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {

    return String(value ?? "").replace(
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
   STARS
===================================================== */

function renderStars(rating) {

    const value = Number(rating) || 0;

    let html = "";

    for (let i = 1; i <= 5; i++) {

        html +=
            i <= value
                ? '<i class="fa-solid fa-star"></i>'
                : '<i class="fa-regular fa-star"></i>';
    }

    return html;
}


/* =====================================================
   DATE
===================================================== */

function formatDate(date) {

    if (!date) {
        return "-";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "-";
    }

    return parsed.toLocaleString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


/* =====================================================
   INITIALS
===================================================== */

function getInitials(name) {

    const parts =
        String(name || "Guest")
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    if (!parts.length) {
        return "G";
    }

    if (parts.length === 1) {
        return parts[0]
            .charAt(0)
            .toUpperCase();
    }

    return (
        parts[0].charAt(0) +
        parts[parts.length - 1].charAt(0)
    ).toUpperCase();
}


/* =====================================================
   LOAD REVIEWS
===================================================== */

async function loadReviews() {

    if (!reviewsContainer) {
        return;
    }

    reviewsContainer.innerHTML = `

        <div class="admin-reviews-loading">

            <i class="fa-solid fa-spinner fa-spin"></i>

            Loading reviews...

        </div>

    `;

    try {

        const response =
            await api(
                `${API_URL}/admin/all`
            );

        reviews =
            Array.isArray(response.reviews)
                ? response.reviews
                : Array.isArray(response)
                    ? response
                    : [];

        updateSummary();

        renderReviews();

    } catch (error) {

        console.error(
            "LOAD REVIEWS ERROR:",
            error
        );

        reviewsContainer.innerHTML = `

            <div class="admin-reviews-error">

                <i class="fa-solid fa-circle-exclamation"></i>

                <p>
                    Failed to load reviews.
                </p>

            </div>

        `;

        showMessage(
            error.message ||
            "Failed to load reviews.",
            "error"
        );
    }
}


/* =====================================================
   SUMMARY
===================================================== */

function updateSummary() {

    const total =
        reviews.length;

    const ratingTotal =
        reviews.reduce(
            (sum, review) =>
                sum +
                (
                    Number(review.rating) || 0
                ),
            0
        );

    const average =
        total
            ? (
                ratingTotal / total
            ).toFixed(1)
            : "0.0";

    const replied =
        reviews.filter(
            review =>
                String(
                    review.adminReply || ""
                ).trim()
        ).length;

    if (totalReviews) {
        totalReviews.textContent =
            total;
    }

    if (averageRating) {
        averageRating.textContent =
            average;
    }

    if (repliedReviews) {
        repliedReviews.textContent =
            replied;
    }
}


/* =====================================================
   RENDER REVIEWS
===================================================== */

function renderReviews() {

    if (!reviewsContainer) {
        return;
    }

    if (!reviews.length) {

        reviewsContainer.innerHTML = `

            <div class="admin-reviews-empty">

                <i class="fa-regular fa-comment-dots"></i>

                <h3>
                    No reviews yet
                </h3>

                <p>
                    Customer reviews will appear here.
                </p>

            </div>

        `;

        return;
    }

    reviewsContainer.innerHTML =
        reviews
            .map(
                review =>
                    createReviewCard(review)
            )
            .join("");

    attachReplyCounters();
}


/* =====================================================
   REVIEW CARD
===================================================== */

function createReviewCard(review) {

    const id =
        Number(review.id);

    const name =
        escapeHtml(
            review.name || "Guest"
        );

    const email =
        escapeHtml(
            review.email || "-"
        );

    const comment =
        escapeHtml(
            review.comment || ""
        );

    const adminReply =
        escapeHtml(
            review.adminReply || ""
        );

    const status =
        review.status || "Approved";

    const rating =
        Number(review.rating) || 0;

    const date =
        formatDate(
            review.createdAt
        );

    const statusClass =
        status === "Rejected"
            ? "review-status rejected"
            : "review-status approved";

    return `

        <article
            class="admin-review-card"
            data-review-id="${id}"
        >

            <div class="admin-review-card-top">

                <div class="admin-review-user">

                    <div class="admin-review-avatar">

                        ${escapeHtml(
                            getInitials(
                                review.name
                            )
                        )}

                    </div>

                    <div>

                        <h3>
                            ${name}
                        </h3>

                        <span>
                            ${email}
                        </span>

                    </div>

                </div>

                <span class="${statusClass}">
                    ${escapeHtml(status)}
                </span>

            </div>


            <div class="admin-review-rating">

                <div class="admin-review-stars">
                    ${renderStars(rating)}
                </div>

                <strong>
                    ${rating}/5
                </strong>

            </div>


            <div class="admin-review-date">

                <i class="fa-regular fa-clock"></i>

                ${escapeHtml(date)}

            </div>


            <div class="admin-review-comment">

                <p>
                    ${comment}
                </p>

            </div>


            <div class="admin-reply-preview">

                <label>
                    Café's Reply
                </label>

                ${
                    adminReply
                        ? `
                            <p class="existing-reply">
                                ${adminReply}
                            </p>
                        `
                        : `
                            <p class="no-reply">
                                No reply yet.
                            </p>
                        `
                }

            </div>


            <div class="admin-review-reply-box">

                <label for="reply-${id}">
                    ${
                        adminReply
                            ? "Edit Reply"
                            : "Write a Reply"
                    }
                </label>

                <textarea
                    id="reply-${id}"
                    class="review-reply-input"
                    rows="3"
                    maxlength="500"
                    placeholder="Write your reply to this customer..."
                >${adminReply}</textarea>

                <div class="review-reply-count">

                    <span>0</span>
                    / 500

                </div>

            </div>


            <div class="admin-review-actions">

                <button
                    type="button"
                    class="btn success"
                    onclick="approveReview(${id})"
                >
                    <i class="fa-solid fa-check"></i>
                    Approve
                </button>


                <button
                    type="button"
                    class="btn secondary"
                    onclick="saveReply(${id})"
                >
                    <i class="fa-solid fa-reply"></i>
                    Save Reply
                </button>


                <button
                    type="button"
                    class="btn danger"
                    onclick="rejectReview(${id})"
                >
                    <i class="fa-solid fa-xmark"></i>
                    Reject
                </button>


                <button
                    type="button"
                    class="btn danger"
                    onclick="deleteReview(${id})"
                >
                    <i class="fa-solid fa-trash"></i>
                    Delete
                </button>

            </div>

        </article>

    `;
}


/* =====================================================
   UPDATE REVIEW
===================================================== */

async function updateReview(id, data) {

    try {

        const result =
            await api(
                `${API_URL}/${id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(data)
                }
            );

        showMessage(
            result.message ||
            "Review updated successfully."
        );

        await loadReviews();

    } catch (error) {

        console.error(
            "UPDATE REVIEW ERROR:",
            error
        );

        showMessage(
            error.message ||
            "Failed to update review.",
            "error"
        );
    }
}


/* =====================================================
   APPROVE
===================================================== */

async function approveReview(id) {

    const confirmed =
        confirm(
            "Approve this review?"
        );

    if (!confirmed) {
        return;
    }

    await updateReview(
        id,
        {
            status: "Approved"
        }
    );
}


/* =====================================================
   REJECT
===================================================== */

async function rejectReview(id) {

    const confirmed =
        confirm(
            "Reject this review? It will no longer appear publicly."
        );

    if (!confirmed) {
        return;
    }

    await updateReview(
        id,
        {
            status: "Rejected"
        }
    );
}


/* =====================================================
   SAVE REPLY
===================================================== */

async function saveReply(id) {

    const input =
        document.getElementById(
            `reply-${id}`
        );

    if (!input) {

        showMessage(
            "Reply field not found.",
            "error"
        );

        return;
    }

    const reply =
        input.value.trim();

    if (reply.length > 500) {

        showMessage(
            "Reply cannot exceed 500 characters.",
            "error"
        );

        return;
    }

    await updateReview(
        id,
        {
            adminReply:
                reply || null
        }
    );
}


/* =====================================================
   DELETE
===================================================== */

async function deleteReview(id) {

    const confirmed =
        confirm(
            "Are you sure you want to permanently delete this review?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const result =
            await api(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );

        showMessage(
            result.message ||
            "Review deleted successfully."
        );

        await loadReviews();

    } catch (error) {

        console.error(
            "DELETE REVIEW ERROR:",
            error
        );

        showMessage(
            error.message ||
            "Failed to delete review.",
            "error"
        );
    }
}


/* =====================================================
   REPLY CHARACTER COUNTERS
===================================================== */

function attachReplyCounters() {

    document
        .querySelectorAll(
            ".review-reply-input"
        )
        .forEach(
            textarea => {

                const counter =
                    textarea
                        .closest(
                            ".admin-review-reply-box"
                        )
                        ?.querySelector(
                            ".review-reply-count span"
                        );

                if (!counter) {
                    return;
                }

                function updateCounter() {

                    counter.textContent =
                        String(
                            textarea.value.length
                        );
                }

                textarea.addEventListener(
                    "input",
                    updateCounter
                );

                updateCounter();
            }
        );
}


/* =====================================================
   REFRESH
===================================================== */

if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        loadReviews
    );
}


/* =====================================================
   INITIAL LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadReviews();

    }
);


/* =====================================================
   GLOBAL FUNCTIONS
===================================================== */

window.loadReviews =
    loadReviews;

window.approveReview =
    approveReview;

window.rejectReview =
    rejectReview;

window.saveReply =
    saveReply;

window.deleteReview =
    deleteReview;