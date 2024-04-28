from django.urls import re_path

from .consumers.chat import ChatConsumer

websocket_urlpatterns = [
    re_path(r"ws/socket-server/chat", ChatConsumer.as_asgi()),
]
