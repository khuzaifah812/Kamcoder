from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(generics.ListAPIView):
    """GET /api/notifications/ -- replaces reading localStorage("notifications")
    filtered by the logged-in student's regno."""

    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(student=self.request.user.student_profile)


class NotificationDeleteView(generics.DestroyAPIView):
    """DELETE /api/notifications/<id>/ -- replaces the mark-read/remove button."""

    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(student=self.request.user.student_profile)


class NotificationClearAllView(APIView):
    """DELETE /api/notifications/clear/ -- replaces the "Clear All" button."""

    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        Notification.objects.filter(student=request.user.student_profile).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
