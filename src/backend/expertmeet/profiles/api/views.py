from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from uuid import UUID

from pathlib import Path

from django.http import FileResponse
from django.shortcuts import get_object_or_404
from profiles.models import Profile, Review, ReviewSummary
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from utils.permissions.is_resource_owner import IsResourceOwner

from .serializers import ProfileSerializer, ReviewSerializer, ReviewSummarySerializer


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


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_review(request, profile_id: UUID) -> Response:
    raise NotImplementedError("TODO: implement")


@api_view(["DELETE"])
@permission_classes([IsAuthenticated & IsResourceOwner])
def delete_review(request, review_id: UUID) -> Response:
    raise NotImplementedError("TODO: implement")


@api_view(["PUT"])
@permission_classes([IsAuthenticated & IsResourceOwner])
def update_review(request, review_id: UUID) -> Response:
    raise NotImplementedError("TODO: implement")


@api_view(["GET"])
def get_reviews_feed(_request, profile_id: UUID) -> Response:
    reviews = Review.objects.filter(profile=profile_id)

    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_review_summary(_request, profile_id: UUID) -> Response:
    review_summary = ReviewSummary.objects.filter(profile=profile_id).first()

    serializer = ReviewSummarySerializer(review_summary)
    return Response(serializer.data, status=status.HTTP_200_OK)
