from profiles.models import Profile, Review, ReviewSummary
from rest_framework.serializers import ModelSerializer


class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"
        # TODO : change fields - remove is_premium

class ReviewSerializer(ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"


class ReviewSummarySerializer(ModelSerializer):
    class Meta:
        model = ReviewSummary
        fields = "__all__"
