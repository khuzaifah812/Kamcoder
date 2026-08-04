from django.contrib import admin

from .models import BorrowRecord


@admin.register(BorrowRecord)
class BorrowRecordAdmin(admin.ModelAdmin):
    list_display = ("student", "book", "borrow_date", "due_date", "is_returned", "returned_date")
    list_filter = ("is_returned",)
