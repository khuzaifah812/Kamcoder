from django.urls import path

from .views import NotificationClearAllView, NotificationDeleteView, NotificationListView

urlpatterns = [
    path("", NotificationListView.as_view(), name="notification-list"),
    path("clear/", NotificationClearAllView.as_view(), name="notification-clear"),
    path("<int:pk>/", NotificationDeleteView.as_view(), name="notification-delete"),
]
