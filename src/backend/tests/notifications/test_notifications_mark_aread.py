import pytest
import uuid
from service.models import Notification
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from ..utils.notification_api_client import notification_api_client, API_PROFILE_ID

@pytest.fixture
def mock_profile_id():
    return uuid.uuid4()

@pytest.fixture
def url():
    return reverse('mark_all_notifications_as_read')

def test_not_authenticated(url):
    response = APIClient().get(path=url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
@pytest.mark.parametrize("amount", [(0),(1),(3)])
def test_correct_request(url, notification_api_client, amount):
    for _ in range(amount):
        Notification.objects.create(profile=uuid.uuid4()) # for each notification add 1 more that is not connected to current user
        Notification.objects.create(profile=API_PROFILE_ID) # for each notification add 1 more that is not connected to current user

    assert Notification.objects.count() == amount * 2
    assert Notification.objects.filter(profile=API_PROFILE_ID).count() == amount

    response = notification_api_client.post(url)

    assert response.status_code == status.HTTP_200_OK
    assert Notification.objects.count() == amount
    assert Notification.objects.filter(profile=API_PROFILE_ID).count() == 0