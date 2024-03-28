from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from service.models import Notification

from .permissions import CanRegisterNotifications
from .serializers import NotificationDeserializer, NotificationSerializer


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

@api_view(["POST"])
@permission_classes([IsAuthenticated & CanRegisterNotifications])
def add_notification(request) -> Response:
    deserializer = NotificationDeserializer(data=request.data)
    if not deserializer.is_valid():
        return Response(deserializer.errors, status=status.HTTP_400_BAD_REQUEST)

    Notification.objects.create(
        profile=deserializer.validated_data["profile_id"],
    )

    return Response(status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated & CanRegisterNotifications])
def mark_notification_as_read(request) -> Response:
    raise NotImplementedError


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_all_notifications_as_read(request) -> Response:
    profile_id = request.user.profile_id
    notifications = Notification.objects.filter(profile=profile_id)
    notifications.delete()

    return Response(status=status.HTTP_200_OK)
