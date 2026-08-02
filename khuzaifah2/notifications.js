document.addEventListener("DOMContentLoaded", () => {
    
    const list = document.getElementById("notificationsList");
    const noMsg = document.getElementById("noNotifMsg");
    const clearBtn = document.getElementById("clearAllBtn");
    const FINE_RATE = 1000;

    let student = JSON.parse(localStorage.getItem("loggedInUser"));
    if(!student){ window.location.href = "login.html"; return; }

    let borrowed = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

    // 1. AUTO GENERATE NOTIFICATIONS
    function generateNotifications(){
        let today = new Date();
        today.setHours(0,0,0,0);
        let myBooks = borrowed.filter(b => b.regno === student.registration);

        myBooks.forEach(book => {
            let due = new Date(book.dueDate);
            due.setHours(0,0,0,0);
            let diffDays = Math.floor((due - today) / (1000*60*60*24));
            let notifId = `${student.registration}_${book.bookId}`;

            // Due Soon: 2 days before
            if(diffDays === 2){
                addNotif(notifId+"_due", "warning", "Book Due Soon", `"${book.title}" is due in 2 days on ${book.dueDate}`);
            }

            // Overdue
            if(diffDays < 0){
                let overdueDays = Math.abs(diffDays);
                let fine = overdueDays * FINE_RATE;
                addNotif(notifId+"_over", "overdue", "Book Overdue!", `"${book.title}" is ${overdueDays} days overdue. Fine: UGX ${fine}`);
            }
        });
    }

    function addNotif(id, type, title, message){
        // don't add duplicate
        let exists = notifications.find(n => n.id === id && n.regno === student.registration);
        if(!exists){
            notifications.push({
                id: id,
                regno: student.registration,
                type: type,
                title: title,
                message: message,
                time: new Date().toLocaleString(),
                read: false
            });
            localStorage.setItem("notifications", JSON.stringify(notifications));
        }
    }

    // 2. RENDER NOTIFICATIONS
    function renderNotifications(){
        let myNotifs = notifications.filter(n => n.regno === student.registration).reverse();
        list.innerHTML = "";

        if(myNotifs.length === 0){
            noMsg.style.display = "block";
        } else {
            noMsg.style.display = "none";
        }

        myNotifs.forEach(n => {
            let icon = "fa-info-circle";
            if(n.type === "overdue") icon = "fa-triangle-exclamation";
            if(n.type === "warning") icon = "fa-clock";
            if(n.type === "success") icon = "fa-circle-check";

            list.innerHTML += `
                <div class="notif-item ${n.type}">
                    <i class="fas ${icon} notif-icon"></i>
                    <div class="notif-content">
                        <h4>${n.title}</h4>
                        <p>${n.message}</p>
                        <div class="notif-time">${n.time}</div>
                    </div>
                    <button class="mark-read" data-id="${n.id}"><i class="fas fa-xmark"></i></button>
                </div>
            `;
        });

        addRemoveEvents();
    }

    // 3. REMOVE NOTIFICATION
    function addRemoveEvents(){
        document.querySelectorAll(".mark-read").forEach(btn => {
            btn.addEventListener("click", (e) => {
                let id = e.target.closest("button").dataset.id;
                notifications = notifications.filter(n => n.id !== id);
                localStorage.setItem("notifications", JSON.stringify(notifications));
                renderNotifications();
            });
        });
    }

    // 4. CLEAR ALL
    clearBtn.addEventListener("click", () => {
        notifications = notifications.filter(n => n.regno !== student.registration);
        localStorage.setItem("notifications", JSON.stringify(notifications));
        renderNotifications();
    });

    // Run on load
    generateNotifications();
    renderNotifications();
});