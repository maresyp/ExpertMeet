from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from uuid import UUID

from pathlib import Path

from django.contrib.auth.models import User
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.models import Profile

from .serializers import NewUserSerializer, ProfileSerializer


@api_view(["GET"])
def get_routes(_request):
    routes = [
        "/api/token",
        "/api/token/refresh",
    ]

    return Response(routes)


@api_view(["POST"])
def register_user(request) -> Response:
    user_serializer = NewUserSerializer(data=request.data)

    if not user_serializer.is_valid():
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=user_serializer.data["email"]).exists():
        return Response({"errors": ["User with this email address already exists."]}, status=status.HTTP_400_BAD_REQUEST)

    _user = User.objects.create_user(
        username=user_serializer.data["email"],
        email=user_serializer.data["email"],
        password=user_serializer.data["password"],
        first_name=user_serializer.data["first_name"],
        last_name=user_serializer.data["last_name"],
    )

    return Response(status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_profile(request):
    profile = get_object_or_404(Profile, user=request.user)

    serializer = ProfileSerializer(profile)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
def visit_profile(_request, profile_id: UUID) -> Response:
    profile = get_object_or_404(Profile, id=profile_id)

    serializer = ProfileSerializer(profile)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def get_profile_picture(_request, profile_id: UUID) -> FileResponse:
    profile = get_object_or_404(Profile, id=profile_id)
    return FileResponse(Path(profile.profile_image.path).open("rb"), content_type="image/jpg")  # noqa: SIM115 file is closed automatically

@api_view(["Get"])
def get_profile_feed(_request) -> Response:
    profiles = Profile.objects.all()

    serializer = ProfileSerializer(profiles, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
