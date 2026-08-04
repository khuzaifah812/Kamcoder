from django.urls import path

from .views import AdminReportsView, BorrowCreateView, BorrowListView, BorrowReturnView, FinesView

urlpatterns = [
    path("", BorrowListView.as_view(), name="borrow-list"),
    path("borrow/", BorrowCreateView.as_view(), name="borrow-create"),
    path("<int:pk>/return/", BorrowReturnView.as_view(), name="borrow-return"),
    path("fines/", FinesView.as_view(), name="fines"),
    path("admin/reports/", AdminReportsView.as_view(), name="admin-reports"),
]
