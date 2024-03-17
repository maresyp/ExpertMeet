from profiles.models import Profile
from rest_framework.serializers import ModelSerializer


class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"
        # TODO : change fields - remove is_premium
