from django.contrib import admin

from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("registration", "fullname", "course", "phone", "created_at")
    search_fields = ("registration", "fullname", "user__email")
