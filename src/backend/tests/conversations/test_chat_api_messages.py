import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from chat.models import Message
from urllib.parse import urlencode

@pytest.fixture
def api_client():
   return APIClient()

@pytest.fixture
def create_user(db, django_user_model):
    return django_user_model.objects.create_user(username="test@test.com", password="test")

@pytest.fixture
def url(create_user):
    return reverse('get_messages', kwargs={'recipient_id': create_user.id})

@pytest.mark.django_db
def test_not_authenticated(url, api_client: APIClient):
    response = api_client.post(path=url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_authenticated(api_client, create_user, django_user_model):
    user = create_user
    user2 = django_user_model.objects.create_user(username="test2@test.com", password="test")

    url = reverse("get_messages", kwargs={"recipient_id": user2.id})

    api_client.force_authenticate(user=user)
    response = api_client.get(path=url,)

    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_get_initial_messages(api_client, create_user, django_user_model):
    user = create_user
    user2 = django_user_model.objects.create_user(username="test2@test.com", password="test")

    url = reverse("get_messages", kwargs={"recipient_id": user2.id})

    api_client.force_authenticate(user=user)

    for _ in range(5):
        Message.objects.create(
            sender_id=user.id,
            recipient_id=user2.id,
            body="Test Message"
        )

        Message.objects.create(
            sender_id=user2.id,
            recipient_id=user.id,
            body="Test Message"
        )

    response = api_client.get(path=url,)
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 10

@pytest.mark.django_db
def test_get_initial_messages_pagination(api_client, create_user, django_user_model):
    user = create_user
    user2 = django_user_model.objects.create_user(username="test2@test.com", password="test")

    url = reverse("get_messages", kwargs={"recipient_id": user2.id})

    api_client.force_authenticate(user=user)

    for _ in range(15):
        Message.objects.create(
            sender_id=user.id,
            recipient_id=user2.id,
            body="Test Message"
        )

    Message.objects.create(
            sender_id=user.id,
            recipient_id=user2.id,
            body="Newest"
        )

    response = api_client.get(path=url,)
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 10
    assert response.data[-1]['body'] == "Test Message"
    assert response.data[0]['body'] == "Newest"

@pytest.mark.django_db
def test_get_paginated_messages(api_client, create_user, django_user_model):
    user = create_user
    user2 = django_user_model.objects.create_user(username="test2@test.com", password="test")

    for _ in range(10):
        Message.objects.create(
            sender_id=user.id,
            recipient_id=user2.id,
            body="Test Message"
        )

    msg = Message.objects.create(
            sender_id=user.id,
            recipient_id=user2.id,
            body="Test"
        )

    for _ in range(10):
        Message.objects.create(
            sender_id=user.id,
            recipient_id=user2.id,
            body="New Message"
        )

    url = reverse("get_messages", kwargs={"recipient_id": user2.id})
    api_client.force_authenticate(user=user)

    response = api_client.get(path=url)

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 10
    for message in response.data:
        assert message['body'] == "New Message"

    params: dict = {"page": 2}
    response = api_client.get(path=f"{url}?{urlencode(params)}")

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 10
    assert response.data[0]['body'] == "Test"
    assert response.data[-1]['body'] == "Test Message"