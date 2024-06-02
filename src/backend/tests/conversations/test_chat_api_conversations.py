import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from chat.models import Message, Conversation

@pytest.fixture
def api_client():
   return APIClient()

@pytest.fixture
def create_user(db, django_user_model):
    return django_user_model.objects.create_user(username="test@test.com", password="test")

@pytest.fixture
def url():
    return reverse('get_conversations')

@pytest.mark.django_db
def test_not_authenticated(url, api_client: APIClient):
    response = api_client.post(path=url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_authenticated(url, api_client, create_user):
    user = create_user

    api_client.force_authenticate(user=user)
    response = api_client.get(path=url,)

    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_get_conversations(url, api_client, create_user):
    user = create_user

    Message.objects.create(
        sender_id=user.id,
        recipient_id=2,
        body="Test Message"
    )

    assert True == Conversation.objects.filter(person1=user.id, person2=2).exists()

    api_client.force_authenticate(user=user)
    response = api_client.get(path=url)

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1

    first_conversation = response.data[0]

    assert "person1" in first_conversation and first_conversation["person1"] is not None
    assert "person2" in first_conversation and first_conversation["person2"] is not None
    assert "id" in first_conversation and first_conversation["id"] is not None
    assert "last_message_time" in first_conversation and first_conversation["last_message_time"] is not None