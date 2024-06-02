import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

@pytest.fixture
def api_client():
   return APIClient()

@pytest.fixture
def create_user(db, django_user_model):
    return django_user_model.objects.create_user(username="test@test.com", password="test")

@pytest.fixture
def url(create_user):
    return reverse('get_profile_uuid', kwargs={'user_id': create_user.id})

@pytest.mark.django_db
def test_not_authenticated(url, api_client: APIClient):
    response = api_client.get(path=url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_correct_request(url, api_client, create_user):
    user = create_user

    api_client.force_authenticate(user=user)
    response = api_client.get(path=url)

    assert response.status_code == status.HTTP_200_OK
    assert response.data['profile_uuid'] == user.profile.id

@pytest.mark.django_db
def test_non_existing_user(api_client, create_user):
    user = create_user

    api_client.force_authenticate(user=user)
    url = reverse('get_profile_uuid', kwargs={'user_id': create_user.id + 1})
    response = api_client.get(path=url)

    assert response.status_code == status.HTTP_404_NOT_FOUND
