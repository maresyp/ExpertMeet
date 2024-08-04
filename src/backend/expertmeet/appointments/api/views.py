
from __future__ import annotations

from typing import TYPE_CHECKING

from django.shortcuts import get_object_or_404

if TYPE_CHECKING:
    from uuid import UUID

from appointments.models import Appointment, AppointmentStatus, Schedule
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .pagination import StandardResultsSetPagination
from .serializers import AppointmentDeserializer, AppointmentSerializer, ScheduleDeserializer, ScheduleSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_appointments_feed(request) -> Response:
    queryset = Appointment.objects.filter(Q(requested_by__id=request.user.id) | Q(receiver__id=request.user.id))
    paginator = StandardResultsSetPagination()

    filtering = request.GET.get("filtering")
    if filtering:
        if filtering == "sent":
            queryset = queryset.filter(requested_by__id=request.user.id)
        elif filtering == "received":
            queryset = queryset.filter(receiver__id=request.user.id)

    ordering = request.GET.get("ordering")
    if ordering:
        queryset = queryset.order_by(ordering)

    paginated_qs = paginator.paginate_queryset(queryset, request)

    serializer = AppointmentSerializer(paginated_qs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_appointment(request, profile_id: int):
    receiver = get_object_or_404(User, profile__id=profile_id)

    deserializer = AppointmentDeserializer(data=request.data)
    if not deserializer.is_valid():
        return Response(deserializer.errors, status=status.HTTP_400_BAD_REQUEST)

    Appointment.objects.create(
        requested_by=request.user,
        receiver=receiver,
        date_scheduled=deserializer.validated_data["date"],
    )

    return Response({"ok": 200}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def accept_appointment(request, pk: UUID) -> Response:
    appointment = get_object_or_404(Appointment, pk=pk)

    if appointment.status != AppointmentStatus.PENDING.value:
        return Response({"error": "This appointment is not in PENDING state"}, status=status.HTTP_400_BAD_REQUEST)

    if appointment.receiver != request.user:
        return Response({"error": "You are not a receiver of this appointment"}, status=status.HTTP_403_FORBIDDEN)

    appointment.status = AppointmentStatus.ACCEPTED.value
    appointment.save()

    return Response({"ok": 200}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def reject_appointment(request, pk: UUID) -> Response:
    appointment = get_object_or_404(Appointment, pk=pk)

    if appointment.status != AppointmentStatus.PENDING.value:
        return Response({"error": "This appointment is not in PENDING state"}, status=status.HTTP_400_BAD_REQUEST)

    if appointment.receiver != request.user:
        return Response({"error": "You are not a receiver of this appointment"}, status=status.HTTP_403_FORBIDDEN)

    appointment.status = AppointmentStatus.REJECTED.value
    appointment.save()

    return Response({"ok": 200}, status=status.HTTP_200_OK)

@api_view(["GET"])
def get_schedule(_request, profile_id: int) -> Response:
    user = get_object_or_404(User, profile__id=profile_id)
    schedule = get_object_or_404(Schedule, owner=user.id)

    serializer = ScheduleSerializer(schedule)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_schedule(request) -> Response:
    schedule = get_object_or_404(Schedule, owner=request.user.id)

    deserializer = ScheduleDeserializer(data=request.data)
    if not deserializer.is_valid():
        return Response(deserializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = deserializer.validated_data
    schedule.monday_start = data["monday"]["start"]
    schedule.monday_end = data["monday"]["end"]
    schedule.tuesday_start = data["tuesday"]["start"]
    schedule.tuesday_end = data["tuesday"]["end"]
    schedule.wednesday_start = data["wednesday"]["start"]
    schedule.wednesday_end = data["wednesday"]["end"]
    schedule.thursday_start = data["thursday"]["start"]
    schedule.thursday_end = data["thursday"]["end"]
    schedule.friday_start = data["friday"]["start"]
    schedule.friday_end = data["friday"]["end"]
    schedule.saturday_start = data["saturday"]["start"]
    schedule.saturday_end = data["saturday"]["end"]
    schedule.sunday_start = data["sunday"]["start"]
    schedule.sunday_end = data["sunday"]["end"]
    schedule.save()

    return Response({"ok": 200}, status=status.HTTP_200_OK)
