document.addEventListener("DOMContentLoaded", async () => {

    const tableBody = document.getElementById("finesTableBody");
    const noFinesMsg = document.getElementById("noFinesMsg");

    if (!requireLogin()) return;

    let student;
    try {
        student = await Api.me();
    } catch (err) {
        Auth.clear();
        window.location.href = "login.html";
        return;
    }

    async function renderFines() {
        let info;
        try {
            info = await Api.fines(); // computed server-side, no more client-side date math
        } catch (err) {
            return;
        }

        tableBody.innerHTML = "";
        noFinesMsg.style.display = info.fines.length === 0 ? "block" : "none";

        info.fines.forEach(f => {
            tableBody.innerHTML += `
                <tr>
                    <td>${f.title}</td>
                    <td>${f.dueDate}</td>
                    <td>${f.overdueDays} days</td>
                    <td>UGX ${f.fine}</td>
                    <td><span class="badge-overdue">Overdue</span></td>
                </tr>
            `;
        });

        document.getElementById("overdueCount").innerText = info.overdueCount;
        document.getElementById("totalFine").innerText = `UGX ${info.totalFine}`;
        document.getElementById("totalOverdueDays").innerText = info.totalOverdueDays;
    }

    renderFines();
});
