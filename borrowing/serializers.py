from django.conf import settings
from rest_framework import serializers

from books.models import Book

from .models import BorrowRecord


class BorrowRecordSerializer(serializers.ModelSerializer):
    bookId = serializers.CharField(source="book.book_id", read_only=True)
    title = serializers.CharField(source="book.title", read_only=True)
    regno = serializers.CharField(source="student.registration", read_only=True)
    borrowDate = serializers.DateField(source="borrow_date", read_only=True)
    dueDate = serializers.DateField(source="due_date", read_only=True)
    isOverdue = serializers.SerializerMethodField()
    overdueDays = serializers.SerializerMethodField()
    fine = serializers.SerializerMethodField()

    class Meta:
        model = BorrowRecord
        fields = [
            "id", "bookId", "title", "regno", "borrowDate", "dueDate",
            "is_returned", "returned_date", "isOverdue", "overdueDays", "fine",
        ]

    def get_isOverdue(self, obj):
        return obj.overdue_days > 0

    def get_overdueDays(self, obj):
        return obj.overdue_days

    def get_fine(self, obj):
        return obj.fine_amount(settings.FINE_RATE_PER_DAY)


class BorrowCreateSerializer(serializers.Serializer):
    """POST body for borrowing a book: {"book_id": "BK001"}"""

    book_id = serializers.CharField()

    def validate_book_id(self, value):
        try:
            book = Book.objects.get(book_id=value)
        except Book.DoesNotExist:
            raise serializers.ValidationError("Book not found.")
        if book.copies <= 0:
            raise serializers.ValidationError("No copies left!")
        self.context["book"] = book
        return value
