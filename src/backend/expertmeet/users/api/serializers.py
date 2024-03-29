from rest_framework.serializers import CharField, EmailField, Serializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # custom claims
        token["profile_id"] = str(user.profile.id)

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class NewUserSerializer(Serializer):
    email = EmailField(max_length=64)
    password = CharField(max_length=64)
    first_name = CharField(max_length=32)
    last_name = CharField(max_length=32)
