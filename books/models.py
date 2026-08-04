from django.db import models


class Book(models.Model):
    """Matches book.html's localStorage("libraryBooks") records:
    {id, title, author, category, copies}"""

    book_id = models.CharField(
        max_length=20, unique=True,
        help_text='Human-facing code, e.g. "BK001" - matches the frontend\'s book.id',
    )
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255, blank=True)
    category = models.CharField(max_length=120, blank=True)
    copies = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return f"{self.book_id} - {self.title}"

    @property
    def is_available(self):
        return self.copies > 0
