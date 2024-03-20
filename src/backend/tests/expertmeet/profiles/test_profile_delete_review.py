import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from profiles.models import Review
import uuid

@pytest.fixture
def api_client():
   return APIClient()

@pytest.fixture
def create_user(db, django_user_model):
    return django_user_model.objects.create_user(username="test@test.com", password="test")


@pytest.mark.django_db
def test_correct_deletion(api_client: APIClient, create_user):
    user = create_user
    review = Review.objects.create(
        author=user,
        profile=user.profile,
        rating=5,
        content="Good"
    )

    api_client.force_authenticate(user=user)
    response = api_client.delete(
        path=reverse('delete_review', kwargs={'review_id': review.id})
    )

    assert response.status_code == status.HTTP_200_OK
    assert False == Review.objects.filter(id=review.id).exists()

@pytest.mark.django_db
def test_not_authenticated(api_client: APIClient):
    response = api_client.delete(
        path=reverse('delete_review', kwargs={'review_id': uuid.uuid4()}) # UUID doesn't matter as not authorized will be first
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_not_existing(api_client: APIClient, create_user):
    user = create_user
    api_client.force_authenticate(user=user)
    response = api_client.delete(
        path=reverse('delete_review', kwargs={'review_id': uuid.uuid4()})
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.django_db
def test_resource_not_owned(api_client: APIClient, django_user_model, create_user):
    user1 = create_user
    review = Review.objects.create(
        author=user1,
        profile=user1.profile,
        rating=5,
        content="Good"
    )
    user2 = django_user_model.objects.create_user(username="test2@test.com", password="test")

    api_client.force_authenticate(user=user2)
    response = api_client.delete(
        path=reverse('delete_review', kwargs={'review_id': review.id})
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN