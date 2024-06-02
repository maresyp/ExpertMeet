import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


@pytest.mark.django_db()
def test_get_routes():
    client = APIClient()
    url = reverse("get_routes")
    response = client.get(url)
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db()
def test_token_obtain_pair():
    client = APIClient()
    url = reverse("token_obtain_pair")
    response = client.post(url, {"username": "testuser", "password": "testpassword"})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db()
def test_token_refresh():
    client = APIClient()
    url = reverse("token_refresh")
    response = client.post(url, {"refresh": "testrefresh"})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db()
def test_get_basic_info(django_user_model):
    user = django_user_model.objects.create_user(username="test2@test.com", password="test", first_name="Adam", last_name="Test")
    client = APIClient()
    url = reverse("get_basic_info", kwargs={"user_id": user.id})
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK
    assert response.data["username"] == "test2@test.com"
    assert response.data["first_name"] == "Adam"
    assert response.data["last_name"] == "Test"
