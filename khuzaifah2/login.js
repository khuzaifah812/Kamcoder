document.addEventListener("DOMContentLoaded", function(){

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
    if(togglePassword){
        togglePassword.addEventListener("click", () => {
            if(password.type === "password"){
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

    // ===============================
    // TOAST MESSAGE FUNCTION
    // ===============================
    function showToast(message, color="#0066ff"){
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
        }, 3000);
    }

    // ===============================
    // REGISTRATION NUMBER VALIDATION
    // Format: UICT/2026/001  <-- 3 digits at end to match register.js
    // ===============================
    function validateRegNo(){
        let pattern = /^UICT\/[0-9]{4}\/[0-9]{4}$/; // Fixed: was 4 digits, register uses 3

        if(!pattern.test(regno.value.trim())){
            regError.innerHTML = "Format should be UICT/2026/001";
            regError.style.color = "red";
            return false;
        }
        regError.innerHTML = "";
        return true;
    }

    // ===============================
    // PASSWORD VALIDATION
    // ===============================
    function validatePassword(){
        if(password.value.length < 6){
            passError.innerHTML = "Password must contain at least 6 characters";
            passError.style.color = "red";
            return false;
        }
        passError.innerHTML = "";
        return true;
    }

    // ===============================
    // LOGIN PROCESS
    // ===============================
    loginForm.addEventListener("submit", function(e){
        e.preventDefault();

        let validReg = validateRegNo();
        let validPass = validatePassword();

        if(!validReg || !validPass){
            showToast("Please correct the errors", "red");
            return;
        }

        // Get students from localStorage
        let students = JSON.parse(localStorage.getItem("students")) || [];

        // Find matching student
        let student = students.find(s => 
            s.registration === regno.value.trim() && 
            s.password === password.value
        );

        if(student){
            // Remember Me
            let remember = document.querySelector('input[type="checkbox"]');
            if(remember && remember.checked){
                localStorage.setItem("userRegNo", regno.value.trim());
            }

            // Save logged in user for dashboard
            localStorage.setItem("loggedInUser", JSON.stringify(student));

            showToast("Login Successful", "green");

            // after login success
            if(!localStorage.getItem("libraryBooks")){
             localStorage.setItem("libraryBooks", JSON.stringify([]));
             }
// ... same for others

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1500);

        } else {
            showToast("Invalid registration number or password", "red");
        }

    });

    // ===============================
    // LOAD SAVED USER
    // ===============================
    let savedUser = localStorage.getItem("userRegNo");
    if(savedUser){
        regno.value = savedUser;
    }

});