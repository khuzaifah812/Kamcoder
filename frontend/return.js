document.addEventListener("DOMContentLoaded", async () => {

    const tableBody = document.getElementById("borrowedTableBody");
    const noBooksMsg = document.getElementById("noBooksMsg");
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

    async function renderBorrowed() {
        let myBooks = await Api.myBorrows(true); // active (not yet returned) only

        tableBody.innerHTML = "";
        noBooksMsg.style.display = myBooks.length === 0 ? "block" : "none";

        myBooks.forEach(item => {
            let statusBadge = item.isOverdue
                ? `<span class="badge-overdue">Overdue</span>`
                : `<span class="badge-ok">On Time</span>`;

            tableBody.innerHTML += `
                <tr>
                    <td>${item.title}</td>
                    <td>${item.borrowDate}</td>
                    <td>${item.dueDate}</td>
                    <td>${statusBadge}</td>
                    <td><button class="return-btn" data-id="${item.id}">Return</button></td>
                </tr>
            `;
        });

        updateCounts(myBooks);
        addReturnEvents();
    }

    function addReturnEvents() {
        document.querySelectorAll(".return-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                let borrowId = e.target.dataset.id;
                try {
                    await Api.returnBook(borrowId);
                    showToast("Book returned successfully! It is now Available again.", "green");
                    renderBorrowed();
                } catch (err) {
                    showToast(err.message || "Could not return this book", "red");
                }
            });
        });
    }

    function updateCounts(myBooks) {
        document.getElementById("borrowedCount").innerText = myBooks.length;
        let overdue = myBooks.filter(b => b.isOverdue).length;
        document.getElementById("overdueCount").innerText = overdue;

        let fine = myBooks.reduce((sum, b) => sum + (b.fine || 0), 0);
        document.getElementById("fineAmount").innerText = `UGX ${fine}`;
    }

    renderBorrowed();
});
