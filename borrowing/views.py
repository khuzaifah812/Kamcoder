from datetime import date, timedelta

from django.conf import settings
from django.db import transaction
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from books.models import Book
from notifications.services import create_notification

from .models import BorrowRecord
from .serializers import BorrowCreateSerializer, BorrowRecordSerializer


class BorrowListView(APIView):
    """GET /api/borrow/  -- replaces borrow.js/return.js reading
    localStorage("borrowedBooks") filtered by the logged-in student.

    Query params:
      ?active=true   -> only books not yet returned (for return.html)
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        student = request.user.student_profile
        qs = BorrowRecord.objects.filter(student=student)
        if request.query_params.get("active") == "true":
            qs = qs.filter(is_returned=False)
        return Response(BorrowRecordSerializer(qs, many=True).data)


class BorrowCreateView(APIView):
    """POST /api/borrow/  {"book_id": "BK001"}
    -- replaces borrow.js's addBorrowEvents() click handler."""

    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        student = request.user.student_profile
        serializer = BorrowCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        book_id = serializer.validated_data["book_id"]

        book = Book.objects.select_for_update().get(book_id=book_id)

        if book.copies <= 0:
            return Response({"detail": "No copies left!"}, status=status.HTTP_400_BAD_REQUEST)

        if BorrowRecord.objects.filter(student=student, book=book, is_returned=False).exists():
            return Response(
                {"detail": "You already have this book borrowed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        book.copies -= 1
        book.save(update_fields=["copies"])

        due_date = date.today() + timedelta(days=settings.BORROW_PERIOD_DAYS)
        record = BorrowRecord.objects.create(student=student, book=book, due_date=due_date)

        create_notification(
            student,
            key=f"borrow_{book.book_id}_{record.id}",
            ntype="success",
            title="Book Borrowed",
            message=f'You borrowed "{book.title}". Due: {due_date.isoformat()}',
        )

        return Response(BorrowRecordSerializer(record).data, status=status.HTTP_201_CREATED)


class BorrowReturnView(APIView):
    """POST /api/borrow/<id>/return/ -- replaces return.js's addReturnEvents()."""

    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        student = request.user.student_profile
        try:
            record = BorrowRecord.objects.select_related("book").get(
                pk=pk, student=student, is_returned=False
            )
        except BorrowRecord.DoesNotExist:
            return Response({"detail": "Active borrow record not found."}, status=404)

        record.is_returned = True
        record.returned_date = date.today()
        record.save(update_fields=["is_returned", "returned_date"])

        book = Book.objects.select_for_update().get(pk=record.book_id)
        book.copies += 1
        book.save(update_fields=["copies"])

        create_notification(
            student,
            key=f"return_{book.book_id}_{record.id}",
            ntype="success",
            title="Book Returned",
            message=f'You returned "{book.title}". It is now Available again.',
        )

        return Response(BorrowRecordSerializer(record).data)


class FinesView(APIView):
    """GET /api/borrow/fines/ -- replaces fines.js's calculateFines()."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        student = request.user.student_profile
        records = BorrowRecord.objects.filter(student=student, is_returned=False)
        data = BorrowRecordSerializer(records, many=True).data
        overdue = [r for r in data if r["overdueDays"] > 0]
        total_fine = sum(r["fine"] for r in overdue)
        total_days = sum(r["overdueDays"] for r in overdue)
        return Response(
            {
                "fines": overdue,
                "overdueCount": len(overdue),
                "totalFine": total_fine,
                "totalOverdueDays": total_days,
                "fineRatePerDay": settings.FINE_RATE_PER_DAY,
            }
        )


class AdminReportsView(APIView):
    """GET /api/borrow/admin/reports/ -- replaces reports.html's stats/most-borrowed/
    overdue calculations that used to read all three localStorage keys directly."""

    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        from django.db.models import Count

        from accounts.models import Student

        total_students = Student.objects.count()
        total_books = Book.objects.count()
        active_borrows = BorrowRecord.objects.filter(is_returned=False)
        total_borrowed = active_borrows.count()

        most_borrowed = (
            BorrowRecord.objects.values("book__book_id", "book__title")
            .annotate(times_borrowed=Count("id"))
            .order_by("-times_borrowed")[:5]
        )

        overdue_qs = active_borrows.select_related("student", "book")
        overdue = [
            {
                "regno": r.student.registration,
                "student": r.student.fullname,
                "book": r.book.title,
                "dueDate": r.due_date.isoformat(),
                "overdueDays": r.overdue_days,
                "fine": r.fine_amount(settings.FINE_RATE_PER_DAY),
            }
            for r in overdue_qs
            if r.overdue_days > 0
        ]

        return Response(
            {
                "totalStudents": total_students,
                "totalBooks": total_books,
                "totalBorrowed": total_borrowed,
                "mostBorrowed": list(most_borrowed),
                "overdue": overdue,
            }
        )
