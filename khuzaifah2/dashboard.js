document.addEventListener("DOMContentLoaded", () => {

    // =============================
    // MOBILE SIDEBAR MENU
    // =============================
    const menuBtn = document.querySelector(".menu-btn");
    const sidebar = document.querySelector(".sidebar");

    if(menuBtn){
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active");
        });
    }

    const FINE_RATE = 1000; // UGX per day

function getOverdueInfo(){
    let borrowed = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
    let student = JSON.parse(localStorage.getItem("loggedInUser"));
    let today = new Date();
    today.setHours(0,0,0,0); // remove time so we compare dates only

    let overdueBooks = [];
    let totalFine = 0;

    borrowed.filter(b => b.regno === student.registration).forEach(b => {
        let due = new Date(b.dueDate);
        due.setHours(0,0,0,0);

        let diffTime = today - due;
        let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // ms to days

        if(diffDays > 0){ // only if overdue
            overdueBooks.push({
               ...b,
                overdueDays: diffDays,
                fine: diffDays * FINE_RATE
            });
            totalFine += diffDays * FINE_RATE;
        }
    });

    return { overdueBooks, totalFine };
}

    // =============================
    // LOAD STUDENT INFORMATION
    // FROM LOGIN / REGISTER
    // =============================
    let student = JSON.parse(localStorage.getItem("loggedInUser")); // CHANGED

    if(student){
        let profileName = document.querySelector(".profile h3");
        let profileReg = document.querySelector(".profile p");
        let profileCourse = document.getElementById("profileCourse");

        if(profileName) profileName.innerHTML = student.fullname.toUpperCase();
        if(profileReg) profileReg.innerHTML = student.registration;        
        if(profileCourse) profileCourse.innerHTML = student.course;
    } else {
        // If no one is logged in, send back to login
        window.location.href = "login.html";
    }

    // =============================
    // GREETING BASED ON TIME
    // =============================
    let heading = document.querySelector("header h1");
    let hour = new Date().getHours();
    let greeting;

    if(hour < 12){
        greeting = "Good Morning";
    } else if(hour < 18){
        greeting = "Good Afternoon";
    } else {
        greeting = "Good Evening";
    }

    if(student && heading){
        heading.innerHTML = `${greeting}, ${student.fullname} 👋`;
    } else if(heading) {
        heading.innerHTML = `${greeting}, Student 👋`;
    }

    // =============================
    // SEARCH BOOKS
    // =============================
    const search = document.querySelector(".search input");
    const books = document.querySelectorAll(".book-card");

    if(search){
        search.addEventListener("keyup", () => {
            let value = search.value.toLowerCase();
            books.forEach(book => {
                let title = book.querySelector("h3").textContent.toLowerCase();
                if(title.includes(value)){
                    book.style.display = "block";
                } else {
                    book.style.display = "none";
                }
            });
        });
    }

    // =============================
    // LOGOUT
    // =============================
    const logout = document.querySelector('a[href="login.html"]');
    
    if(logout){
        logout.addEventListener("click", (e) => {
            let confirmLogout = confirm("Are you sure you want to logout?");
            
            if(confirmLogout){
                // Clear logged in user when logging out
                localStorage.removeItem("loggedInUser");
            } else {
                e.preventDefault();
            }
        });
    }

});