document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");

    // Get all inputs
    const name = document.getElementById("fullname");
    const regno = document.getElementById("regno");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const course = document.getElementById("course"); 
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    // Create Toast
    let toast = document.getElementById("toast");
    if(!toast){
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }

    function showToast(message, color) {
        toast.innerHTML = message;
        toast.style.background = color;
        toast.style.display = "block";
        toast.style.position = "fixed";
        toast.style.top = "20px";
        toast.style.right = "20px";
        toast.style.padding = "12px 20px";
        toast.style.color = "white";
        toast.style.borderRadius = "5px";
        toast.style.zIndex = "9999";

        setTimeout(() => {
            toast.style.display = "none";
        }, 2000); // increased to 2s so user can read
    }

    // Registration number validation: UICT/2026/001
    function checkRegNo() {
        let pattern = /^UICT\/[0-9]{4}\/[0-9]{4}$/;
        if (!pattern.test(regno.value.trim())) {
            showToast("Registration must be UICT/2026/0001 format", "red");
            return false;
        }
        return true;
    }

    // Email validation
    function checkEmail() {
        let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!pattern.test(email.value.trim())) {
            showToast("Enter a valid email address", "red");
            return false;
        }
        return true;
    }

    // Password validation
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

    // Check if regno or email already exists
    function userExists(reg, mail) {
        let students = JSON.parse(localStorage.getItem("students")) || [];
        return students.find(s => s.registration === reg || s.email === mail);
    }

    // Submit Registration
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!checkRegNo()) return;
        if (!checkEmail()) return;
        if (!checkPassword()) return;

        // Check if user already registered
        if (userExists(regno.value.trim(), email.value.trim())) {
            showToast("Registration number or Email already exists", "red");
            return;
        }

        // Get existing students or start new array
        let students = JSON.parse(localStorage.getItem("students")) || [];

        // New student object - NOW INCLUDES DATE FOR ADMIN
        let student = {
            fullname: name.value.trim(),
            name: name.value.trim(), // add this too so admin.html can use .name
            registration: regno.value.trim(),
            email: email.value.trim(),
            phone: phone.value.trim(),
            course: course.value,
            password: password.value, // used for login
            date: new Date().toLocaleDateString() // ADDED FOR ADMIN PANEL
        };

        students.push(student);

        // Save back to localStorage as an array
        localStorage.setItem("students", JSON.stringify(students));

        showToast("Registration Successful", "green");

        form.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);

    });
});