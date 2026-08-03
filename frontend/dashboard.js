document.addEventListener("DOMContentLoaded", async () => {

    // =============================
    // MOBILE SIDEBAR MENU
    // =============================
    const menuBtn = document.querySelector(".menu-btn");
    const sidebar = document.querySelector(".sidebar");

    if (menuBtn) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active");
        });
    }

    if (!requireLogin()) return;

    // =============================
    // LOAD STUDENT INFORMATION - now fetched from the API
    // (previously read from localStorage("loggedInUser"))
    // =============================
    let student;
    try {
        student = await Api.me();
    } catch (err) {
        Auth.clear();
        window.location.href = "login.html";
        return;
    }

    let profileName = document.querySelector(".profile h3");
    let profileReg = document.querySelector(".profile p");
    let profileCourse = document.getElementById("profileCourse");

    if (profileName) profileName.innerHTML = student.fullname.toUpperCase();
    if (profileReg) profileReg.innerHTML = student.registration;
    if (profileCourse) profileCourse.innerHTML = student.course;

    // =============================
    // GREETING BASED ON TIME
    // =============================
    let heading = document.querySelector("header h1");
    let hour = new Date().getHours();
    let greeting;

    if (hour < 12) {
        greeting = "Good Morning";
    } else if (hour < 18) {
        greeting = "Good Afternoon";
    } else {
        greeting = "Good Evening";
    }

    if (heading) {
        heading.innerHTML = `${greeting}, ${student.fullname} 👋`;
    }

    // =============================
    // OVERDUE / FINE SUMMARY - now computed server-side
    // =============================
    try {
        const fineInfo = await Api.fines();
        const fineEl = document.getElementById("fineAmount");
        if (fineEl) fineEl.innerText = `UGX ${fineInfo.totalFine}`;
    } catch (err) { /* ignore on dashboard if elements aren't present */ }

    // =============================
    // SEARCH BOOKS (client-side filter of rendered cards, unchanged)
    // =============================
    const search = document.querySelector(".search input");
    const books = document.querySelectorAll(".book-card");

    if (search) {
        search.addEventListener("keyup", () => {
            let value = search.value.toLowerCase();
            books.forEach(book => {
                let title = book.querySelector("h3").textContent.toLowerCase();
                book.style.display = title.includes(value) ? "block" : "none";
            });
        });
    }

    // =============================
    // LOGOUT
    // =============================
    const logout = document.querySelector('a[href="login.html"]');

    if (logout) {
        logout.addEventListener("click", (e) => {
            let confirmLogout = confirm("Are you sure you want to logout?");
            if (confirmLogout) {
                Api.logout();
            } else {
                e.preventDefault();
            }
        });
    }

});
