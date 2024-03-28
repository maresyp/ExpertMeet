from rest_framework_simplejwt.tokens import RefreshToken
import uuid
from rest_framework.test import APIClient
import pytest

API_PROFILE_ID = str(uuid.UUID('12345678123456781234567812345678'))

class CustomRefreshToken(RefreshToken):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # custom claims
        self['profile_id'] = API_PROFILE_ID
        self['CanRegisterNotifications'] = True

@pytest.fixture
def notification_api_client(db, django_user_model) -> APIClient:
    """ This client has permissions to register notifications """
    user = django_user_model.objects.create_user(username="test@test.com", password="test")
    client = APIClient()
    token = CustomRefreshToken.for_user(user=user)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token.access_token}')
    return client