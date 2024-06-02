from typing import ClassVar

from django.core.validators import MaxValueValidator, MinValueValidator
from profiles.models import Category, Profile, Review, ReviewSummary
from rest_framework.serializers import CharField, FloatField, ModelSerializer, Serializer, SerializerMethodField, UUIDField


class ProfileSerializer(ModelSerializer):
    username = SerializerMethodField()

    class Meta:
        model = Profile
        fields: ClassVar = [
            "id",
            "username",
            "bio",
            "is_premium",
        ]

    def get_username(self, obj) -> str:
        return f"{obj.user.first_name} {obj.user.last_name}"


class ReviewSerializer(ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"


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
