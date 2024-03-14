from rest_framework.serializers import CharField, EmailField, Serializer


class NewUserSerializer(Serializer):
    email = EmailField(max_length=64)
    password = CharField(max_length=64)
    first_name = CharField(max_length=32)
    last_name = CharField(max_length=32)
