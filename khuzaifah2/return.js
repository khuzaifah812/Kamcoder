document.addEventListener("DOMContentLoaded", () => {
    
    const tableBody = document.getElementById("borrowedTableBody");
    const noBooksMsg = document.getElementById("noBooksMsg");
    const toast = document.getElementById("toast");

    let student = JSON.parse(localStorage.getItem("loggedInUser"));
    if(!student){
        window.location.href = "login.html";
        return;
    }

    let books = JSON.parse(localStorage.getItem("libraryBooks")) || [];
    let borrowed = JSON.parse(localStorage.getItem("borrowedBooks")) || [];

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

    function showToast(message, color="#0066ff"){
        toast.innerHTML = message;
        toast.style.background = color;
        toast.style.display = "block";
        setTimeout(() => { toast.style.display = "none"; }, 1000);
    }

    function renderBorrowed(){
        let myBooks = borrowed.filter(b => b.regno === student.registration);
        tableBody.innerHTML = "";
        
        if(myBooks.length === 0){
            noBooksMsg.style.display = "block";
        } else {
            noBooksMsg.style.display = "none";
        }

        myBooks.forEach(item => {
            let today = new Date();
            let due = new Date(item.dueDate);
            let isOverdue = today > due;
            
            let statusBadge = isOverdue 
                ? `<span class="badge-overdue">Overdue</span>` 
                : `<span class="badge-ok">On Time</span>`;

            tableBody.innerHTML += `
                <tr>
                    <td>${item.title}</td>
                    <td>${item.date}</td>
                    <td>${item.dueDate}</td>
                    <td>${statusBadge}</td>
                    <td><button class="return-btn" data-id="${item.bookId}">Return</button></td>
                </tr>
            `;
        });

        updateCounts(myBooks);
        addReturnEvents();
    }

    function addReturnEvents(){
        document.querySelectorAll(".return-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                let bookId = e.target.dataset.id;

                // 1. Find the borrowed record and remove it
                borrowed = borrowed.filter(b => !(b.bookId === bookId && b.regno === student.registration));
                localStorage.setItem("borrowedBooks", JSON.stringify(borrowed));

                // 2. Add copy back to libraryBooks
                let bookIndex = books.findIndex(b => b.id === bookId);
                if(bookIndex !== -1){
                    books[bookIndex].copies += 1; // ADD COPY BACK
                    localStorage.setItem("libraryBooks", JSON.stringify(books)); // SAVE
                }

                showToast("Book returned successfully! It is now Available again.", "green");
                addNotification(`return_${bookId}`, "success", "Book Returned", `You returned "${book.title}". Thank you!`);
                renderBorrowed(); // refresh this page
            });
        });
    }

    function updateCounts(myBooks){
        document.getElementById("borrowedCount").innerText = myBooks.length;
        let overdue = myBooks.filter(b => new Date() > new Date(b.dueDate)).length;
        document.getElementById("overdueCount").innerText = overdue;
        
        let fine = 0;
        myBooks.forEach(b => {
            let diffDays = Math.floor((new Date() - new Date(b.dueDate)) / (1000*60*60*24));
            if(diffDays > 0) fine += diffDays * 1000;
        });
        document.getElementById("fineAmount").innerText = `UGX ${fine}`;
    }

    renderBorrowed();
});

function addNotification(id, type, title, message){
    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    let student = JSON.parse(localStorage.getItem("loggedInUser"));
    notifications.push({
        id: id, regno: student.registration, type, title, message,
        time: new Date().toLocaleString(), read: false
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));
}


