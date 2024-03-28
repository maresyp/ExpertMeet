from django.urls import path

from . import views

urlpatterns = [
    path("notifications/", views.get_notifications_feed, name="get_notifications_feed"),
    path("notifications/count/", views.get_notifications_count, name="get_notifications_count"),
    path("notifications/register/", views.add_notification, name="add_notification"),
    path("notifications/mark_as_read/", views.mark_notification_as_read, name="mark_notification_as_read"),
    path("notifications/mark_all_as_read/", views.mark_all_notifications_as_read, name="mark_all_notifications_as_read"),
]
