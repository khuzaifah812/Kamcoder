from django.conf import settings
from django.core.validators import RegexValidator
from django.db import models

registration_validator = RegexValidator(
    regex=r"^UICT/\d{4}/\d{4}$",
    message="Registration number must look like UICT/2026/0001",
)


class Student(models.Model):
    """
    Extra profile fields for a library student, on top of Django's built-in
    User model (which handles username/password/email/auth).

    We use the registration number as the User.username, so students log in
    with their registration number + password, exactly like the original
    localStorage-based frontend.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_profile",
    )
    fullname = models.CharField(max_length=150)
    registration = models.CharField(
        max_length=20,
        unique=True,
        validators=[registration_validator],
        help_text="Format: UICT/2026/0001",
    )
    phone = models.CharField(max_length=20, blank=True)
    course = models.CharField(max_length=120, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.fullname} ({self.registration})"

    @property
    def email(self):
        return self.user.email
