
from uuid import UUID

from appointments.models import Appointment
from rest_framework.serializers import ModelSerializer, SerializerMethodField


class AppointmentSerializer(ModelSerializer):
    class Meta:
        model = Appointment
        fields = "__all__"

    requested_by_profile_id = SerializerMethodField()
    requested_by_profile_name = SerializerMethodField()
    receiver_profile_id = SerializerMethodField()
    receiver_profile_name = SerializerMethodField()

    def get_requested_by_profile_id(self, obj) -> UUID:
        return obj.requested_by.profile.id

    def get_receiver_profile_id(self, obj) -> UUID:
        return obj.receiver.profile.id

    def get_requested_by_profile_name(self, obj) -> str:
        return f"{obj.requested_by.first_name} {obj.requested_by.last_name}"

    def get_receiver_profile_name(self, obj) -> str:
        return f"{obj.receiver.first_name} {obj.receiver.last_name}"
