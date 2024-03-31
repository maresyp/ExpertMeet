import jwt
from rest_framework.permissions import BasePermission


class CanRegisterNotifications(BasePermission):
    def has_permission(self, request, _view):
        token = jwt.decode(str(request.auth), options={"verify_signature": False})
        return "CanRegisterNotifications" in token
