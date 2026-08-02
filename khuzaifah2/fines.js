document.addEventListener("DOMContentLoaded", () => {
    
    const tableBody = document.getElementById("finesTableBody");
    const noFinesMsg = document.getElementById("noFinesMsg");
    const FINE_RATE = 1000; // UGX per day

    let student = JSON.parse(localStorage.getItem("loggedInUser"));
    if(!student){ window.location.href = "login.html"; return; }

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

    function calculateFines(){
        let myBooks = borrowed.filter(b => b.regno === student.registration);
        let today = new Date();
        let fines = [];

        myBooks.forEach(item => {
            let due = new Date(item.dueDate);
            let diffDays = Math.floor((today - due) / (1000*60*60*24));
            
            if(diffDays > 0){
                fines.push({
                    title: item.title,
                    dueDate: item.dueDate,
                    overdueDays: diffDays,
                    fine: diffDays * FINE_RATE
                });
            }
        });
        return fines;
    }

    function renderFines(){
        let fines = calculateFines();
        tableBody.innerHTML = "";

        if(fines.length === 0){
            noFinesMsg.style.display = "block";
        } else {
            noFinesMsg.style.display = "none";
        }

        let totalFine = 0;
        let totalDays = 0;

        fines.forEach(f => {
            totalFine += f.fine;
            totalDays += f.overdueDays;

            addNotification(`pay_${Date.now()}`, "success", "Fine Paid", `You paid UGX ${totalFine}. Thank you!`);

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

        document.getElementById("overdueCount").innerText = fines.length;
        document.getElementById("totalFine").innerText = `UGX ${totalFine}`;
        document.getElementById("totalOverdueDays").innerText = totalDays;
    }

    renderFines();
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