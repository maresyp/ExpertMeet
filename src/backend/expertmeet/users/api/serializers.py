from rest_framework.serializers import CharField, EmailField, ModelSerializer, Serializer
from users.models import Profile


class NewUserSerializer(Serializer):
    email = EmailField(max_length=64)
    password = CharField(max_length=64)
    first_name = CharField(max_length=32)
    last_name = CharField(max_length=32)

class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"
