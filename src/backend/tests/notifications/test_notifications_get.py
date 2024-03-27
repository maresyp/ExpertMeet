import pytest
import uuid
from service.models import Notification
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from ..utils.auth_api_client import auth_api_client, API_PROFILE_ID

@pytest.fixture
def mock_profile_id():
    return uuid.uuid4()

@pytest.fixture
def url():
    return reverse('get_notifications_feed')

def test_not_authenticated(url):
    response = APIClient().get(path=url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_correct_request(url, auth_api_client):
    response = auth_api_client.get(path=url)
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_get_notification(url, auth_api_client):
    Notification.objects.create(profile=API_PROFILE_ID)
    response = auth_api_client.get(path=url)

    assert response.status_code == status.HTTP_200_OK
    assert response.data is not None

@pytest.mark.django_db
def test_get_multiple_notifications(url, auth_api_client):
    for _ in range(2):
        Notification.objects.create(profile=API_PROFILE_ID)
        Notification.objects.create(profile=uuid.uuid4())

    response = auth_api_client.get(path=url)

    assert response.status_code == status.HTTP_200_OK
    assert response.data is not None
    assert len(response.data) == 2
