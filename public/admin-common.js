function getToken() {
    return localStorage.getItem("token");
}


function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    window.location.href = "/login.html";
}


function apiHeaders() {

    const token = getToken();

    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
}


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


async function api(url, options = {}) {

    const token = getToken();


    if (!token) {

        window.location.href = "/login.html";

        throw new Error("Login required");
    }


    const response = await fetch(
        url,
        {
            ...options,

            headers: {
                ...apiHeaders(),
                ...(options.headers || {})
            }
        }
    );


    const data = await response
        .json()
        .catch(() => ({}));


    if (
        response.status === 401 ||
        response.status === 403
    ) {

        if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("admin");

            window.location.href = "/login.html";
        }

        throw new Error(
            data.message || "Access denied"
        );
    }


    if (!response.ok) {

        throw new Error(
            data.message || "Request failed"
        );
    }


    return data;
}