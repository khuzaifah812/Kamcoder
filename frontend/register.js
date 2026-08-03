document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");

    const name = document.getElementById("fullname");
    const regno = document.getElementById("regno");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const course = document.getElementById("course");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }

    function showToast(message, color) {
        toastOn(toast, message, color);
    }

    function checkRegNo() {
        let pattern = /^UICT\/[0-9]{4}\/[0-9]{4}$/;
        if (!pattern.test(regno.value.trim())) {
            showToast("Registration must be UICT/2026/0001 format", "red");
            return false;
        }
        return true;
    }

    function checkEmail() {
        let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!pattern.test(email.value.trim())) {
            showToast("Enter a valid email address", "red");
            return false;
        }
        return true;
    }

    function checkPassword() {
        if (password.value.length < 6) {
            showToast("Password must be at least 6 characters", "red");
            return false;
        }
        if (password.value !== confirmPassword.value) {
            showToast("Passwords do not match", "red");
            return false;
        }
        return true;
    }

    // ===============================
    // SUBMIT REGISTRATION - now POSTs to the API. The backend itself
    // checks for duplicate registration numbers / emails and hashes
    // the password - it's no longer stored or checked in the browser.
    // ===============================
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!checkRegNo()) return;
        if (!checkEmail()) return;
        if (!checkPassword()) return;

        try {
            await Api.register({
                fullname: name.value.trim(),
                registration: regno.value.trim(),
                email: email.value.trim(),
                phone: phone.value.trim(),
                course: course.value,
                password: password.value,
                confirm_password: confirmPassword.value,
            });

            showToast("Registration Successful", "green");
            form.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);

        } catch (err) {
            showToast(err.message || "Registration failed", "red");
        }
    });
});
