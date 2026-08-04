from .models import Notification


def create_notification(student, key, ntype, title, message):
    """Idempotent: replaces the frontend's addNotification() localStorage push,
    but de-duplicates on (student, key) instead of appending forever."""
    notification, _created = Notification.objects.get_or_create(
        student=student,
        key=key,
        defaults={"type": ntype, "title": title, "message": message},
    )
    return notification
