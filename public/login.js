/* =====================================================
   FUZION CAFE ADMIN LOGIN
   LOGIN + PASSWORD TOGGLE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const loginForm =
        document.getElementById("loginForm");

    const togglePassword =
        document.getElementById("togglePassword");

    const passwordInput =
        document.getElementById("password");

    const emailInput =
        document.getElementById("email");

    const emailError =
        document.getElementById("emailError");

    const passwordError =
        document.getElementById("passwordError");

    const formMessage =
        document.getElementById("formMessage");

    const submitButton =
        loginForm
            ? loginForm.querySelector(
                'button[type="submit"]'
            )
            : null;


    /* =====================================================
       PASSWORD SHOW / HIDE
    ===================================================== */

    if (
        togglePassword &&
        passwordInput
    ) {

        togglePassword.addEventListener(
            "click",
            () => {

                const isPassword =
                    passwordInput.type ===
                    "password";


                passwordInput.type =
                    isPassword
                        ? "text"
                        : "password";


                togglePassword.innerHTML =
                    isPassword
                        ? '<i class="fa-solid fa-eye-slash"></i>'
                        : '<i class="fa-regular fa-eye"></i>';


                togglePassword.setAttribute(
                    "aria-label",
                    isPassword
                        ? "Hide password"
                        : "Show password"
                );

            }
        );

    }


    /* =====================================================
       LOGIN FORM
    ===================================================== */

    if (!loginForm) {

        console.error(
            "Login form not found."
        );

        return;

    }


    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            /* =============================================
               CLEAR OLD ERRORS
            ============================================= */

            if (emailError) {

                emailError.textContent = "";

            }

            if (passwordError) {

                passwordError.textContent = "";

            }

            if (formMessage) {

                formMessage.textContent = "";

                formMessage.className =
                    "form-message";

            }


            /* =============================================
               GET VALUES
            ============================================= */

            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";

            const password =
                passwordInput
                    ? passwordInput.value
                    : "";


            const rememberCheckbox =
                document.querySelector(
                    'input[name="remember"]'
                );


            const rememberMe =
                rememberCheckbox
                    ? rememberCheckbox.checked
                    : false;


            let valid = true;


            /* =============================================
               EMAIL VALIDATION
            ============================================= */

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!email) {

                if (emailError) {

                    emailError.textContent =
                        "Email address is required.";

                }

                valid = false;

            } else if (
                !emailRegex.test(email)
            ) {

                if (emailError) {

                    emailError.textContent =
                        "Please enter a valid email address.";

                }

                valid = false;

            }


            /* =============================================
               PASSWORD VALIDATION
            ============================================= */

            if (!password) {

                if (passwordError) {

                    passwordError.textContent =
                        "Password is required.";

                }

                valid = false;

            } else if (
                password.length < 6
            ) {

                if (passwordError) {

                    passwordError.textContent =
                        "Password must be at least 6 characters.";

                }

                valid = false;

            }


            if (!valid) {

                return;

            }


            /* =============================================
               DISABLE BUTTON
            ============================================= */

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.innerHTML = `
                    <span>Signing in...</span>
                    <i class="fa-solid fa-spinner fa-spin"></i>
                `;

            }


            /* =============================================
               LOGIN API
            ============================================= */

            try {

                const response =
                    await fetch(
                        "/api/auth/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    email,
                                    password,
                                    rememberMe
                                })
                        }
                    );


                const result =
                    await response
                        .json()
                        .catch(() => ({}));


                console.log(
                    "Login response:",
                    result
                );


                /* =========================================
                   LOGIN SUCCESS
                ========================================= */

                if (
                    response.ok &&
                    result.token
                ) {


                    /*
                     * VERY IMPORTANT
                     *
                     * Your admin-common.js uses:
                     *
                     * localStorage.getItem("token")
                     *
                     * Therefore save the token as "token",
                     * NOT "authToken".
                     */

                    localStorage.setItem(
                        "token",
                        result.token
                    );


                    /* Save admin information if backend sends it */

                    if (result.user) {

                        localStorage.setItem(
                            "admin",
                            JSON.stringify(
                                result.user
                            )
                        );

                    } else if (result.admin) {

                        localStorage.setItem(
                            "admin",
                            JSON.stringify(
                                result.admin
                            )
                        );

                    }


                    /* Remember email */

                    if (rememberMe) {

                        localStorage.setItem(
                            "userEmail",
                            email
                        );

                    } else {

                        localStorage.removeItem(
                            "userEmail"
                        );

                    }


                    /* Success message */

                    if (formMessage) {

                        formMessage.textContent =
                            "Login successful! Redirecting...";

                        formMessage.classList.add(
                            "success"
                        );

                    }


                    /* =====================================
                       REDIRECT TO DASHBOARD
                    ===================================== */

                    setTimeout(
                        () => {

                            window.location.href =
                                "/dashboard.html";

                        },
                        800
                    );


                    return;

                }


                /* =========================================
                   LOGIN FAILED
                ========================================= */

                if (formMessage) {

                    formMessage.textContent =
                        result.message ||
                        "Invalid email or password.";

                    formMessage.classList.add(
                        "error"
                    );

                }


                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.innerHTML = `
                        <span>
                            Sign in to Dashboard
                        </span>

                        <i class="fa-solid fa-arrow-right"></i>
                    `;

                }


            } catch (error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );


                if (formMessage) {

                    formMessage.textContent =
                        "Unable to connect to the server. Please try again.";

                    formMessage.classList.add(
                        "error"
                    );

                }


                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.innerHTML = `
                        <span>
                            Sign in to Dashboard
                        </span>

                        <i class="fa-solid fa-arrow-right"></i>
                    `;

                }

            }

        }
    );


    /* =====================================================
       REMEMBERED EMAIL
    ===================================================== */

    const savedEmail =
        localStorage.getItem(
            "userEmail"
        );


    if (
        savedEmail &&
        emailInput
    ) {

        emailInput.value =
            savedEmail;


        const rememberCheckbox =
            document.querySelector(
                'input[name="remember"]'
            );


        if (rememberCheckbox) {

            rememberCheckbox.checked =
                true;

        }

    }

});