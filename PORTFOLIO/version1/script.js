


/* ================= MOBILE MENU ================= */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("active");

});


/* Close mobile menu after clicking a link */

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

    });

});


/* ================= DARK / LIGHT MODE ================= */

const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    themeToggle.textContent = "☀️";

}


themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    const darkMode = document.body.classList.contains("dark-mode");

    if (darkMode) {

        localStorage.setItem("portfolio-theme", "dark");

        themeToggle.textContent = "☀️";

    } else {

        localStorage.setItem("portfolio-theme", "light");

        themeToggle.textContent = "🌙";

    }

});


/* =====================================================
   GOOGLE APPS SCRIPT CONTACT FORM
===================================================== */

/*
   IMPORTANT:

   Replace the URL below with your deployed
   Google Apps Script Web App URL.

   Example:

   https://script.google.com/macros/s/XXXXXXXXXXXX/exec
*/

const GOOGLE_SCRIPT_URL =
    "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";


const contactForm = document.getElementById("contactForm");

const formMessage = document.getElementById("formMessage");

const submitBtn = document.getElementById("submitBtn");


contactForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    /* Make sure the Apps Script URL has been configured */

    if (
        GOOGLE_SCRIPT_URL ===
        "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"
    ) {

        formMessage.textContent =
            "The contact form has not been configured yet. Please try again later.";

        formMessage.className = "form-message error";

        return;

    }


    /* Disable button while sending */

    submitBtn.disabled = true;

    submitBtn.textContent = "Sending...";


    formMessage.textContent = "";

    formMessage.className = "form-message";


    /* Collect form data */

    const formData = {

        name: document.getElementById("name").value.trim(),

        email: document.getElementById("email").value.trim(),

        subject: document.getElementById("subject").value.trim(),

        message: document.getElementById("message").value.trim()

    };


    try {

        /*
            Send the message to Google Apps Script.

            no-cors is used because the portfolio and
            Apps Script Web App are different origins.
        */

        await fetch(GOOGLE_SCRIPT_URL, {

            method: "POST",

            mode: "no-cors",

            headers: {

                "Content-Type": "text/plain;charset=utf-8"

            },

            body: JSON.stringify(formData)

        });


        /*
            Because no-cors prevents JavaScript from reading
            the server response, we display the success
            message after the request has been submitted.
        */

        formMessage.textContent =
            "Thank you! Khuzaifah has received your message soon is going to reply you back.";

        formMessage.className = "form-message success";


        /* Clear the form */

        contactForm.reset();


    } catch (error) {

        console.error("Message sending error:", error);

        formMessage.textContent =
            "Sorry, your message could not be sent. Please try again.";

        formMessage.className = "form-message error";

    }


    /* Re-enable button */

    submitBtn.disabled = false;

    submitBtn.textContent = "Send Message";

});

