
from uuid import UUID

from appointments.models import Appointment, Schedule
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import DateTimeField, ModelSerializer, Serializer, SerializerMethodField, TimeField


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


class AppointmentDeserializer(Serializer):
    date = DateTimeField()


class ScheduleSerializer(ModelSerializer):
    class Meta:
        model = Schedule
        fields = "__all__"


class TimeRangeDeserializer(Serializer):
    time_format = "%H:%M"
    start = TimeField(required=False, allow_null=True, format=time_format)
    end = TimeField(required=False, allow_null=True, format=time_format)

    def validate(self, data):
        start = data.get("start")
        end = data.get("end")

        if start and end and start > end:
            msg: str = "Start time cannot be after end time."
            raise ValidationError(msg)

        return data


class ScheduleDeserializer(Serializer):
    monday = TimeRangeDeserializer(required=False, allow_null=True)
    tuesday = TimeRangeDeserializer(required=False, allow_null=True)
    wednesday = TimeRangeDeserializer(required=False, allow_null=True)
    thursday = TimeRangeDeserializer(required=False, allow_null=True)
    friday = TimeRangeDeserializer(required=False, allow_null=True)
    saturday = TimeRangeDeserializer(required=False, allow_null=True)
    sunday = TimeRangeDeserializer(required=False, allow_null=True)
