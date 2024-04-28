import json
from urllib.parse import parse_qs

from channels.middleware import BaseMiddleware
from django.conf import settings
from django.db import close_old_connections
from jwt import decode as jwt_decode
from rest_framework import status
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken


class JwtAuthMiddleware(BaseMiddleware):
    """Middleware for JWT based auth"""

    async def __call__(self, scope, receive, send):
        close_old_connections()

        try:
            token = parse_qs(scope["query_string"].decode("utf8"))["token"][0]
        except KeyError:
            await self.send_error_message(send, "No token provided.", status.HTTP_400_BAD_REQUEST)
            return None

        # Try to authenticate the user
        try:
            AccessToken(token)
        except (InvalidToken, TokenError):
            # Token is invalid
            await self.send_error_message(send, "Invalid token.", status.HTTP_401_UNAUTHORIZED)
            return None
        else:
            #  Then token is valid, decode it
            decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])

            # Get the user using ID
            scope["user_id"] = decoded_data["user_id"]

        return await self.inner(scope, receive, send)

    async def send_error_message(self, send, msg: str, code: int):
        await send(
            {
                "type": "websocket.close",
                "code": code,
                "error": json.dumps({"error": msg}),
            },
        )
