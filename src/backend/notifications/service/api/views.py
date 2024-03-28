from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from service.models import Notification

from .serializers import NotificationSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_notifications_feed(request) -> Response:
    notifications = Notification.objects.filter(profile=request.user.profile_id)
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_notifications_count(request) -> Response:
    notifications_count: int = Notification.objects.filter(profile=request.user.profile_id).count()
    return Response({"count": notifications_count}, status=status.HTTP_200_OK)
