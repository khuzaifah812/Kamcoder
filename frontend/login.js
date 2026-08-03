document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const regno = document.getElementById("regno");
    const password = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const regError = document.getElementById("regError");
    const passError = document.getElementById("passError");
    const toast = document.getElementById("toast");

    // ===============================
    // SHOW / HIDE PASSWORD
    // ===============================
    if (togglePassword) {
        togglePassword.addEventListener("click", () => {
            if (password.type === "password") {
                password.type = "text";
                togglePassword.classList.remove("fa-eye");
                togglePassword.classList.add("fa-eye-slash");
            } else {
                password.type = "password";
                togglePassword.classList.remove("fa-eye-slash");
                togglePassword.classList.add("fa-eye");
            }
        });
    }

    function showToast(message, color = "#0066ff") {
        toastOn(toast, message, color);
    }

    // Registration number validation: UICT/2026/0001
    function validateRegNo() {
        let pattern = /^UICT\/[0-9]{4}\/[0-9]{4}$/;
        if (!pattern.test(regno.value.trim())) {
            regError.innerHTML = "Format should be UICT/2026/0001";
            regError.style.color = "red";
            return false;
        }
        regError.innerHTML = "";
        return true;
    }

    function validatePassword() {
        if (password.value.length < 6) {
            passError.innerHTML = "Password must contain at least 6 characters";
            passError.style.color = "red";
            return false;
        }
        passError.innerHTML = "";
        return true;
    }

    // ===============================
    // LOGIN PROCESS - now calls the API instead of reading
    // localStorage("students")
    // ===============================
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        let validReg = validateRegNo();
        let validPass = validatePassword();

        if (!validReg || !validPass) {
            showToast("Please correct the errors", "red");
            return;
        }

        try {
            await Api.login(regno.value.trim(), password.value);

            let remember = document.querySelector('input[type="checkbox"]');
            if (remember && remember.checked) {
                localStorage.setItem("userRegNo", regno.value.trim());
            }

            showToast("Login Successful", "green");

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1500);

        } catch (err) {
            showToast(err.message || "Invalid registration number or password", "red");
        }
    });

    // ===============================
    // LOAD SAVED USER (just prefills the regno field - not sensitive)
    // ===============================
    let savedUser = localStorage.getItem("userRegNo");
    if (savedUser) {
        regno.value = savedUser;
    }

});
