document.addEventListener("DOMContentLoaded", async () => {

    const bookGrid = document.getElementById("bookGrid");
    const searchInput = document.getElementById("searchBooks");
    const toast = document.getElementById("toast");

    if (!requireLogin()) return;

    let student;
    try {
        student = await Api.me();
    } catch (err) {
        Auth.clear();
        window.location.href = "login.html";
        return;
    }

    function showToast(message, color = "#0066ff") {
        toastOn(toast, message, color);
    }

    // Books + my active borrow records now come from the API
    let books = [];
    let myActiveBorrows = [];

    async function loadData() {
        [books, myActiveBorrows] = await Promise.all([
            Api.listBooks(),
            Api.myBorrows(true),
        ]);
    }

    function renderBooks(bookList) {
        bookGrid.innerHTML = "";
        bookList.forEach(book => {
            let isBorrowed = myActiveBorrows.find(b => b.bookId === book.id);

            let statusText = book.copies > 0 ? "Available" : "Out of Stock";
            if (isBorrowed) statusText = "Borrowed";

            const card = document.createElement("div");
            card.classList.add("borrow-card");
            card.innerHTML = `
                <h3>${book.title}</h3>
                <p>Author: ${book.author}</p>
                <p>Copies Left: ${book.copies}</p>
                <span class="status" style="color:${book.copies > 0 ? 'green' : 'red'}">
                    ${statusText}
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

    function addBorrowEvents() {
        document.querySelectorAll(".borrow-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                let bookId = e.target.dataset.id;
                let book = books.find(b => b.id === bookId);

                try {
                    let record = await Api.borrowBook(bookId);
                    showToast(`"${book.title}" borrowed successfully! Due: ${record.dueDate}`, "green");
                    await loadData();
                    renderBooks(books);
                } catch (err) {
                    showToast(err.message || "Could not borrow this book", "red");
                }
            });
        });
    }

    function updateCounts() {
        document.getElementById("availableCount").innerText = books.length;
        document.getElementById("borrowedCount").innerText = myActiveBorrows.length;
        document.getElementById("pendingCount").innerText = 0;

        Api.fines().then(info => {
            document.getElementById("fineAmount").innerText = `UGX ${info.totalFine}`;
        }).catch(() => {
            document.getElementById("fineAmount").innerText = "UGX 0";
        });
    }

    searchInput.addEventListener("keyup", async () => {
        let val = searchInput.value.toLowerCase();
        let filtered = books.filter(b => b.title.toLowerCase().includes(val));
        renderBooks(filtered);
    });

    await loadData();
    renderBooks(books);
});
