from django.urls import path

from . import views

urlpatterns = [
    path("appointments/feed", views.get_appointments_feed, name="appointments_feed"),
]
