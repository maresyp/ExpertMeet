from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APIClient
import uuid
import pytest

API_PROFILE_ID = uuid.UUID('12345678123456781234567812345678')

class CustomRefreshToken(RefreshToken):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # custom claims
        self['profile_id'] = API_PROFILE_ID

@pytest.fixture
def auth_api_client(db, django_user_model) -> APIClient:
    user = django_user_model.objects.create_user(username="test@test.com", password="test")
    client = APIClient()
    token = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token.access_token}')
    return client