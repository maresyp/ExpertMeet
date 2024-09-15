from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from uuid import UUID

from pathlib import Path

from appointments.models import Appointment
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import (
    ValidationError,
)
from django.db.models import F, Q
from django.db.models.functions import Lower, Substr
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from django_filters.utils import translate_validation
from profiles.models import Category, Profile, Review, ReviewSummary
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from utils.permissions.is_resource_owner import IsResourceOwner

from .filters import ProfileFilter
from .pagination import StandardResultsSetPagination
from .serializers import (
    CategorySerializer,
    PasswordChangeDeserializer,
    ProfileDeserializer,
    ProfileSerializer,
    ReviewDeserializer,
    ReviewSerializer,
    ReviewSummarySerializer,
)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_profile(request):
    profile = get_object_or_404(Profile, user=request.user)

    serializer = ProfileSerializer(profile)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    deserializer = ProfileDeserializer(data=request.data)
    if not deserializer.is_valid():
        return Response(deserializer.errors, status=status.HTTP_400_BAD_REQUEST)

    profile = get_object_or_404(Profile, user=request.user)

    if "category" in deserializer.validated_data:
        profile.category = Category(pk=deserializer.validated_data["category"])
    if "bio" in deserializer.validated_data:
        profile.bio = deserializer.validated_data["bio"]
    if "description" in deserializer.validated_data:
        profile.description = deserializer.validated_data["description"]

    profile.save()
    return Response(data={"ok": 200}, status=status.HTTP_200_OK)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def change_password(request):
    deserializer = PasswordChangeDeserializer(data=request.data)
    if not deserializer.is_valid():
        return Response(deserializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = request.user
    if not user.check_password(deserializer.validated_data["old_password"]):
        return Response({"error": "Old password is not correct"}, status=status.HTTP_400_BAD_REQUEST)

    if deserializer.validated_data["new_password1"] != deserializer.validated_data["new_password2"]:
        return Response({"error": "New passwords don't match"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        validate_password(deserializer.validated_data["new_password1"], user)
        user.set_password(deserializer.validated_data["new_password1"])
        user.save()
    except ValidationError as e:
        return Response({"error": list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)


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
def get_profile_picture_by_user(_request, user_id: int):
    profile = get_object_or_404(Profile, user__id=user_id)
    return FileResponse(Path(profile.profile_image.path).open("rb"), content_type="image/jpg")  # noqa: SIM115 file is closed automatically


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile_uuid(_request, user_id: int):
    profile = get_object_or_404(Profile, user__id=user_id)
    return Response({"profile_uuid": profile.id})


@api_view(["GET"])
def get_profile_feed(request) -> Response:
    queryset = Profile.objects.all()
    paginator = StandardResultsSetPagination()
    paginator.page_size = 20

    filter_set = ProfileFilter(request.GET, queryset=queryset)
    if not filter_set.is_valid():
        raise translate_validation(filter_set.errors)

    queryset = filter_set.qs
    ordering = request.GET.get("ordering")
    if ordering:
        if ordering in ("last_name", "-last_name"):
            queryset = queryset.annotate(last_name=Lower(Substr(F("user__last_name"), 1, 1)))
        queryset = queryset.order_by(ordering)

    paginated_qs = paginator.paginate_queryset(queryset, request)

    serializer = ProfileSerializer(paginated_qs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["PUT"])
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

    user = get_object_or_404(User, profile__id=profile_id)
    if not Appointment.objects.filter(Q(requested_by=request.user) & Q(receiver=user.id)):
        return Response({"errors": ["You don't have any appointments with given user"]}, status=status.HTTP_406_NOT_ACCEPTABLE)

    Review.objects.create(
        author=request.user,
        profile=profile,
        rating=deserializer.validated_data["rating"],
        content=deserializer.validated_data["content"],
    )

    return Response({"ok": status.HTTP_201_CREATED}, status=status.HTTP_201_CREATED)


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
def get_reviews_feed(request, profile_id: UUID) -> Response:
    queryset = Review.objects.filter(profile=profile_id)
    paginator = StandardResultsSetPagination()

    ordering = request.GET.get("ordering")
    if ordering:
        queryset = queryset.order_by(ordering)

    paginated_qs = paginator.paginate_queryset(queryset, request)

    serializer = ReviewSerializer(paginated_qs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_review_summary(_request, profile_id: UUID) -> Response:
    review_summary = ReviewSummary.objects.filter(profile=profile_id).first()

    serializer = ReviewSummarySerializer(review_summary)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_profile_categories(_request) -> Response:
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
