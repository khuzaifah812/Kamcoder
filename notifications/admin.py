from django.contrib import admin

from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("student", "type", "title", "created_at", "is_read")
    list_filter = ("type", "is_read")
