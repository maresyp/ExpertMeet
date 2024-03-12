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
