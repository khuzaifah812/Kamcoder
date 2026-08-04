from datetime import date

from django.conf import settings
from django.db import models

from books.models import Book


class BorrowRecord(models.Model):
    """Matches localStorage("borrowedBooks") records:
    {bookId, title, regno, borrowDate, dueDate}"""

    student = models.ForeignKey(
        "accounts.Student", on_delete=models.CASCADE, related_name="borrow_records"
    )
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="borrow_records")
    borrow_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    returned_date = models.DateField(null=True, blank=True)
    is_returned = models.BooleanField(default=False)

    class Meta:
        ordering = ["-borrow_date"]

    def __str__(self):
        return f"{self.student.registration} -> {self.book.book_id}"

    @property
    def overdue_days(self):
        if self.is_returned:
            return 0
        delta = (date.today() - self.due_date).days
        return max(delta, 0)

    def fine_amount(self, rate_per_day):
        return self.overdue_days * rate_per_day
