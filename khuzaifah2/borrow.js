document.addEventListener("DOMContentLoaded", () => {
    
    const bookGrid = document.getElementById("bookGrid");
    const searchInput = document.getElementById("searchBooks");
    const toast = document.getElementById("toast");

    // Load logged in student
    let student = JSON.parse(localStorage.getItem("loggedInUser"));
    if(!student){
        window.location.href = "login.html";
        return;
    }

    // Sample books - later you can load from localStorage too
   let books = JSON.parse(localStorage.getItem("libraryBooks")) || [];
    let borrowed = JSON.parse(localStorage.getItem("borrowedBooks")) || [];

    function showToast(message, color="#0066ff"){
        toast.innerHTML = message;
        toast.style.background = color;
        toast.style.display = "block";
        setTimeout(() => { toast.style.display = "none"; }, 3000);
    }

function renderBooks(bookList){
    bookGrid.innerHTML = "";
    bookList.forEach(book => {
        let isBorrowed = borrowed.find(b => b.bookId === book.id && b.regno === student.registration);
        
        // FIX: Calculate status based on copies
        let statusText = book.copies > 0 ? "Available" : "Out of Stock";
        if(isBorrowed) statusText = "Borrowed";

        let statusColor = book.copies > 0 ? "green" : "red";
        if(isBorrowed) statusColor = "orange";
        
        const card = document.createElement("div");
        card.classList.add("borrow-card");
     card.innerHTML = `
    <h3>${book.title}</h3>
    <p>Author: ${book.author}</p>
    <p>Copies Left: ${book.copies}</p>  
    <span class="status" style="color:${book.copies > 0 ? 'green' : 'red'}">
        ${isBorrowed ? "Borrowed" : book.copies > 0 ? "Available" : "Out of Stock"}
    </span>
    <button class="borrow-btn" ${isBorrowed || book.copies <= 0 ? "disabled" : ""} data-id="${book.id}">
        ${isBorrowed ? "Already Borrowed" : book.copies <= 0 ? "Out of Stock" : "Borrow Now"}
    </button>
`;
        bookGrid.appendChild(card);
    });

    updateCounts();
    addBorrowEvents();
}

function addBorrowEvents(){
    document.querySelectorAll(".borrow-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            let bookId = e.target.dataset.id;
            let bookIndex = books.findIndex(b => b.id === bookId);
            let book = books[bookIndex];

            if(book.copies <= 0){
                showToast("No copies left!", "red");
                return;
            }

            // 1. Reduce copies
            books[bookIndex].copies -= 1;
            localStorage.setItem("libraryBooks", JSON.stringify(books));

            // 2. Create dates
            let borrowDate = new Date(); // today
            let dueDate = new Date();
            dueDate.setDate(borrowDate.getDate() + 7); // 7 days loan period

            // 3. Add to borrowed list
            let newBorrow = {
                bookId: book.id,
                title: book.title,
                regno: student.registration,
                borrowDate: borrowDate.toISOString().split('T')[0], // format: 2026-08-02
                dueDate: dueDate.toISOString().split('T')[0], // format: 2026-08-09
            };

            borrowed.push(newBorrow);
            localStorage.setItem("borrowedBooks", JSON.stringify(borrowed));

            showToast(`"${book.title}" borrowed successfully! Due: ${newBorrow.dueDate}`, "green");
            addNotification(`borrow_${book.id}`, "success", "Book Borrowed", `You borrowed "${book.title}". Due: ${newBorrow.dueDate}`);


            renderBooks(books);
        });
    });
}
    function updateCounts(){
        document.getElementById("availableCount").innerText = books.length;
        document.getElementById("borrowedCount").innerText = borrowed.filter(b => b.regno === student.registration).length;
        document.getElementById("pendingCount").innerText = 0;
        document.getElementById("fineAmount").innerText = "UGX 0";
    }

    // Search
    searchInput.addEventListener("keyup", () => {
        let val = searchInput.value.toLowerCase();
        let filtered = books.filter(b => b.title.toLowerCase().includes(val));
        renderBooks(filtered);
    });

    renderBooks(books);
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