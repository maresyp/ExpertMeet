from __future__ import annotations

from typing import ClassVar
from uuid import UUID

from django.core.validators import MaxValueValidator, MinValueValidator
from profiles.models import Category, Profile, Review, ReviewSummary
from rest_framework.serializers import CharField, FloatField, ModelSerializer, Serializer, SerializerMethodField, UUIDField


class ProfileSerializer(ModelSerializer):
    username = SerializerMethodField()
    category = SerializerMethodField()

    class Meta:
        model = Profile
        fields: ClassVar = ["id", "username", "bio", "category", "description"]

    def get_username(self, obj) -> str:
        return f"{obj.user.first_name} {obj.user.last_name}"

    def get_category(self, obj) -> str | None:
        return str(obj.category.name) if obj.category else None

class ProfileDeserializer(Serializer):
    category = UUIDField()
    bio = CharField(max_length=256)
    description = CharField(max_length=1028)

class PasswordChangeDeserializer(Serializer):
    old_password = CharField(max_length=128)
    new_password1 = CharField(max_length=128)
    new_password2 = CharField(max_length=128)


class ReviewSerializer(ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"

    author_profile_id = SerializerMethodField()
    author_profile_name = SerializerMethodField()

    def get_author_profile_id(self, obj) -> UUID:
        return obj.author.profile.id

    def get_author_profile_name(self, obj) -> str:
        return f"{obj.author.first_name} {obj.author.last_name}"


class ReviewSummarySerializer(ModelSerializer):
    class Meta:
        model = ReviewSummary
        fields = "__all__"

class ReviewDeserializer(Serializer):
    rating = FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)])
    content = CharField(max_length=256)

class CategoryDeserializer(Serializer):
    id = UUIDField()


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"
