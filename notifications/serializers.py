from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    regno = serializers.CharField(source="student.registration", read_only=True)
    time = serializers.DateTimeField(source="created_at", read_only=True, format="%d/%m/%Y, %H:%M:%S")
    read = serializers.BooleanField(source="is_read")

    class Meta:
        model = Notification
        fields = ["id", "key", "regno", "type", "title", "message", "time", "read"]
