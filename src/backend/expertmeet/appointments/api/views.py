
from __future__ import annotations
from uuid import UUID

from appointments.models import Appointment
from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .pagination import StandardResultsSetPagination
from .serializers import AppointmentSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_appointments_feed(request) -> Response:
    queryset = Appointment.objects.filter(Q(requested_by__id=request.user.id) | Q(receiver__id=request.user.id))
    paginator = StandardResultsSetPagination()

    ordering = request.GET.get("ordering")
    if ordering:
        queryset = queryset.order_by(ordering)

    paginated_qs = paginator.paginate_queryset(queryset, request)

    serializer = AppointmentSerializer(paginated_qs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_appointment(request): ...


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def accept_appointment(request, pk: UUID): ...


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def reject_appointment(request, pk: UUID): ...