document.addEventListener("DOMContentLoaded", async () => {

    const list = document.getElementById("notificationsList");
    const noMsg = document.getElementById("noNotifMsg");
    const clearBtn = document.getElementById("clearAllBtn");

    if (!requireLogin()) return;

    let student;
    try {
        student = await Api.me();
    } catch (err) {
        Auth.clear();
        window.location.href = "login.html";
        return;
    }

    // Note: "due soon" and "overdue" notifications are now generated
    // server-side (see the backend's `generate_notifications` management
    // command, meant to run daily via cron) instead of being recomputed -
    // and re-added - every time this page loads.

    async function renderNotifications() {
        let myNotifs;
        try {
            myNotifs = await Api.notifications();
        } catch (err) {
            return;
        }

        list.innerHTML = "";
        noMsg.style.display = myNotifs.length === 0 ? "block" : "none";

        myNotifs.forEach(n => {
            let icon = "fa-info-circle";
            if (n.type === "overdue") icon = "fa-triangle-exclamation";
            if (n.type === "warning") icon = "fa-clock";
            if (n.type === "success") icon = "fa-circle-check";

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

    function addRemoveEvents() {
        document.querySelectorAll(".mark-read").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                let id = e.target.closest("button").dataset.id;
                try {
                    await Api.deleteNotification(id);
                    renderNotifications();
                } catch (err) { /* ignore */ }
            });
        });
    }

    clearBtn.addEventListener("click", async () => {
        try {
            await Api.clearNotifications();
            renderNotifications();
        } catch (err) { /* ignore */ }
    });

    renderNotifications();
});
