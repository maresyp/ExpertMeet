from django.urls import path

from . import views

urlpatterns = [
    path("appointments/feed", views.get_appointments_feed, name="appointments_feed"),
    path("appointments/accept/<uuid:pk>", views.accept_appointment, name="accept_appointment"),
    path("appointments/reject/<uuid:pk>", views.reject_appointment, name="reject_appointment"),
    #
    path("appointments/get_schedule/<int:pk>", views.get_schedule, name="get_schedule"),
    path("appointments/update_schedule", views.update_schedule, name="update_schedule"),
]
