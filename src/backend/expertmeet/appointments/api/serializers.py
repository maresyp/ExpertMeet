
from appointments.models import Appointment
from rest_framework.serializers import ModelSerializer


class AppointmentSerializer(ModelSerializer):
    class Meta:
        model = Appointment
        fields = "__all__"
