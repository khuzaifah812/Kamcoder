from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/books/", include("books.urls")),
    path("api/borrow/", include("borrowing.urls")),
    path("api/notifications/", include("notifications.urls")),
]
