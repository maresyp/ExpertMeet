import pytest
import uuid
from service.models import Notification
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from ..utils.notification_api_client import notification_api_client, API_PROFILE_ID

@pytest.mark.django_db
def test_not_authenticated():
    url = reverse('mark_notification_as_read', kwargs={"notification_id": uuid.uuid4()})

    response = APIClient().post(path=url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_not_exists(notification_api_client):
    Notification.objects.create(profile=API_PROFILE_ID)
    url = reverse('mark_notification_as_read', kwargs={"notification_id": uuid.uuid4()})

    response = notification_api_client.post(path=url)
    assert response.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.django_db
def test_not_owned(notification_api_client):
    notification = Notification.objects.create(profile=uuid.uuid4())
    url = reverse('mark_notification_as_read', kwargs={"notification_id": notification.id})

    response = notification_api_client.post(path=url)
    assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
def test_correct_request(notification_api_client):
    notification = Notification.objects.create(profile=API_PROFILE_ID)
    url = reverse('mark_notification_as_read', kwargs={"notification_id": notification.id})

    response = notification_api_client.post(path=url)

    assert response.status_code == status.HTTP_200_OK
    assert Notification.objects.count() == 0

@pytest.mark.django_db
@pytest.mark.parametrize("amount", [(0),(1),(3)])
def test_correct_multiple_notifications(notification_api_client, amount):
    notification = Notification.objects.create(profile=API_PROFILE_ID)
    for _ in range(amount):
        Notification.objects.create(profile=API_PROFILE_ID)

    url = reverse('mark_notification_as_read', kwargs={"notification_id": notification.id})

    response = notification_api_client.post(path=url)

    assert response.status_code == status.HTTP_200_OK
    assert Notification.objects.count() == amount