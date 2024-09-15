from django.urls import re_path

from .consumers.chat import ChatConsumer
from .consumers.video import VideoConsumer

websocket_urlpatterns = [
    re_path(r"ws/socket-server/chat/", ChatConsumer.as_asgi()),
    re_path(r"ws/socket-server/video/", VideoConsumer.as_asgi()),
]
