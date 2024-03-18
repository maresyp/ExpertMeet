from rest_framework.permissions import BasePermission


class IsResourceOwner(BasePermission):
    """
    Custom permission to only allow owners of an object to access it.
    """

    def has_object_permission(self, request, _view, obj):
        # Permissions are only granted to the owner of the snippet.
        return obj.owner == request.user
