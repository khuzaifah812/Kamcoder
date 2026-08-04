from django.db import models


class Notification(models.Model):
    """Matches localStorage("notifications") records:
    {id, regno, type, title, message, time, read}"""

    TYPE_CHOICES = [
        ("success", "Success"),
        ("warning", "Warning"),
        ("overdue", "Overdue"),
        ("info", "Info"),
    ]

    student = models.ForeignKey(
        "accounts.Student", on_delete=models.CASCADE, related_name="notifications"
    )
    key = models.CharField(
        max_length=100,
        help_text="Stable dedupe key, e.g. 'borrow_BK001' or 'due_BK001_2026-08-10'.",
    )
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="info")
    title = models.CharField(max_length=150)
    message = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]
        unique_together = ("student", "key")

    def __str__(self):
        return f"{self.student.registration}: {self.title}"
