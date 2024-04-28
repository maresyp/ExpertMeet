"""
ASGI config for conversations project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

# ruff: noqa: E402

import os

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "conversations.settings")
django.setup()

import chat.routing
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

from conversations.middleware import JwtAuthMiddleware

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AllowedHostsOriginValidator(
            JwtAuthMiddleware(
                AuthMiddlewareStack(
                    URLRouter(
                        chat.routing.websocket_urlpatterns,
                    ),
                ),
            ),
        ),
    },
)
