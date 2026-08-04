from datetime import date

from django.conf import settings
from django.core.management.base import BaseCommand

from borrowing.models import BorrowRecord
from notifications.services import create_notification


class Command(BaseCommand):
    """Run daily (e.g. via cron) to generate 'due soon' and 'overdue' notifications.

    Replaces the original frontend's generateNotifications(), which ran this
    logic (buggily, and duplicating on every page load) inside notifications.js.
    """

    help = "Generate due-soon and overdue notifications for active borrow records."

    def handle(self, *args, **options):
        today = date.today()
        active = BorrowRecord.objects.filter(is_returned=False).select_related("student", "book")
        created = 0

        for record in active:
            days_left = (record.due_date - today).days

            if days_left == settings.DUE_SOON_REMINDER_DAYS:
                create_notification(
                    record.student,
                    key=f"due_soon_{record.id}",
                    ntype="warning",
                    title="Book Due Soon",
                    message=f'"{record.book.title}" is due in {days_left} days on {record.due_date.isoformat()}',
                )
                created += 1

            if days_left < 0:
                overdue_days = abs(days_left)
                fine = overdue_days * settings.FINE_RATE_PER_DAY
                create_notification(
                    record.student,
                    key=f"overdue_{record.id}_{overdue_days}",
                    ntype="overdue",
                    title="Book Overdue!",
                    message=f'"{record.book.title}" is {overdue_days} days overdue. Fine: UGX {fine}',
                )
                created += 1

        self.stdout.write(self.style.SUCCESS(f"Done. {created} notification(s) processed."))
