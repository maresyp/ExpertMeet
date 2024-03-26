from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from uuid import UUID

from pathlib import Path

from django.http import FileResponse
from django.shortcuts import get_object_or_404
from profiles.models import Category, Profile, Review, ReviewSummary
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from utils.permissions.is_resource_owner import IsResourceOwner

from .serializers import CategorySerializer, ProfileSerializer, ReviewDeserializer, ReviewSerializer, ReviewSummarySerializer


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


@api_view(["GET"])
def get_profile_feed(_request) -> Response:
    profiles = Profile.objects.all()

    serializer = ProfileSerializer(profiles, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_review(request, profile_id: UUID) -> Response:
    deserializer = ReviewDeserializer(data=request.data)
    if not deserializer.is_valid():
        return Response(deserializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Prevent self review
    profile = get_object_or_404(Profile, id=profile_id)
    if profile.user == request.user:
        return Response({"errors": ["Self review is not possible"]}, status=status.HTTP_406_NOT_ACCEPTABLE)

    if profile.review_set.filter(author=request.user).exists():
        return Response({"errors": ["Can't make more than one review for given profile"]}, status=status.HTTP_406_NOT_ACCEPTABLE)

    Review.objects.create(
        author=request.user,
        profile=profile,
        rating=deserializer.validated_data["rating"],
        content=deserializer.validated_data["content"],
    )

    return Response(status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_review(request, review_id: UUID) -> Response:
    instance = get_object_or_404(Review, id=review_id)
    if not IsResourceOwner().has_object_permission(request, None, instance):
        return Response({"errors": ["You must own resource to delete it"]}, status=status.HTTP_403_FORBIDDEN)

    instance.delete()
    return Response(status=status.HTTP_200_OK)


@api_view(["PUT"])
@permission_classes([IsAuthenticated & IsResourceOwner])
def update_review(request, review_id: UUID) -> Response:
    deserializer = ReviewDeserializer(data=request.data)
    if not deserializer.is_valid():
        return Response(deserializer.errors, status=status.HTTP_400_BAD_REQUEST)

    instance = get_object_or_404(Review, id=review_id)
    if not IsResourceOwner().has_object_permission(request, None, instance):
        return Response({"errors": ["You must own resource to modify it"]}, status=status.HTTP_403_FORBIDDEN)

    instance.rating = deserializer.validated_data["rating"]
    instance.content = deserializer.validated_data["content"]
    instance.save()

    return Response(status=status.HTTP_200_OK)


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


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def assign_profile_category(_request) -> Response:
    msg: str = "TODO: implement assign_profile_category"
    raise NotImplementedError(msg)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_profile_category(_request) -> Response:
    msg: str = "TODO: implement remove_profile_category"
    raise NotImplementedError(msg)


@api_view(["GET"])
def get_profile_categories(_request) -> Response:
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
