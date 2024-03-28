import pytest
import uuid
from service.models import Notification
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from ..utils.auth_api_client import auth_api_client, API_PROFILE_ID
from ..utils.notification_api_client import notification_api_client

@pytest.fixture
def mock_profile_id():
    return uuid.uuid4()

@pytest.fixture
def url():
    return reverse('add_notification')


@pytest.mark.django_db
def test_not_authenticated(url):
    response = APIClient().post(path=url, data={"profile_id": API_PROFILE_ID})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_lacks_permissions(url, auth_api_client):
    response = auth_api_client.post(path=url, data={"profile_id": API_PROFILE_ID})
    assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
@pytest.mark.parametrize("amount", [(0),(1),(3)])
def test_correct_request(url, notification_api_client, amount):
    for _ in range(amount):
        Notification.objects.create(profile=uuid.uuid4()) # for each notification add 1 more that is not connected to current user
        response = notification_api_client.post(path=url, data={"profile_id": API_PROFILE_ID})
        assert response.status_code == status.HTTP_200_OK

    assert Notification.objects.count() == amount * 2
    assert Notification.objects.filter(profile=API_PROFILE_ID).count() == amount

# TODO: Add more test cases for validation of serialized data inside notifications
# TODO: Add more test cases for validation of deserialized data sent to api