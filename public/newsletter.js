/* =====================================================
   NEWSLETTER ADMIN
===================================================== */

function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function loadSubscribers() {

    const tableBody =
        document.getElementById("subscriberTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = `
        <tr>
            <td colspan="4" class="empty">
                Loading...
            </td>
        </tr>
    `;

    try {

        const response = await fetch(
            "/api/newsletter",
            { headers: getAuthHeaders() }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to load subscribers"
            );
        }

        const subscribers =
            data.subscribers || [];

        if (subscribers.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="empty">
                        No newsletter subscribers found.
                    </td>
                </tr>
            `;

            return;
        }

        tableBody.innerHTML =
            subscribers.map(subscriber => {

                const date =
                    subscriber.createdAt
                        ? new Date(
                            subscriber.createdAt
                        ).toLocaleString()
                        : "N/A";

                return `
                    <tr>

                        <td>
                            ${subscriber.id}
                        </td>

                        <td>
                            ${subscriber.email}
                        </td>

                        <td>
                            ${date}
                        </td>

                        <td>

                            <button
                                type="button"
                                class="btn danger"
                                onclick="deleteSubscriber(${subscriber.id})">
                                Delete
                            </button>

                        </td>

                    </tr>
                `;

            }).join("");

    } catch (error) {

        console.error(
            "Newsletter loading error:",
            error
        );

        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty">
                    Failed to load newsletter subscribers.
                </td>
            </tr>
        `;
    }
}


/* =====================================================
   DELETE SUBSCRIBER
===================================================== */

async function deleteSubscriber(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this subscriber?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `/api/newsletter/${id}`,
            {
                method: "DELETE",
                headers: getAuthHeaders()
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to delete subscriber"
            );

        }

        alert(
            "Subscriber deleted successfully."
        );

        loadSubscribers();

    } catch (error) {

        console.error(
            "Delete subscriber error:",
            error
        );

        alert(
            error.message ||
            "Failed to delete subscriber."
        );
    }
}


/* =====================================================
   LOAD WHEN PAGE OPENS
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadSubscribers();

    }
);