from django.urls import path

from . import views

urlpatterns = [
    path("chat/messages/<int:recipient_id>/", views.get_messages, name="get_messages"),
    path("chat/messages/<int:recipient_id>/<uuid:message_id>/", views.get_messages, name="get_messages"),
]
