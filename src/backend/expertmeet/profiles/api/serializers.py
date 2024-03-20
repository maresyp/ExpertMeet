from typing import ClassVar

from django.core.validators import MaxValueValidator, MinValueValidator
from profiles.models import Profile, Review, ReviewSummary
from rest_framework.serializers import CharField, FloatField, ModelSerializer, Serializer


class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields: ClassVar = ["id", "user"]


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
