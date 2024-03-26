import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from profiles.models import Category

@pytest.fixture
def api_client():
   return APIClient()

@pytest.mark.django_db
def test_get_categories(api_client: APIClient):
    obj = Category.objects.create(
        name="Test"
    )

    response = api_client.get(
        path=reverse("get_profile_categories")
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data[0]['id'] == str(obj.id)
    assert response.data[0]['name'] == obj.name