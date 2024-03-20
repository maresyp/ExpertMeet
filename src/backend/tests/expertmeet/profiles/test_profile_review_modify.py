import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
import uuid
from profiles.models import Review

@pytest.fixture
def api_client():
   return APIClient()

@pytest.fixture
def create_user(db, django_user_model):
    return django_user_model.objects.create_user(username="test@test.com", password="test")


@pytest.mark.django_db
def test_not_authenticated(api_client: APIClient):
    response = api_client.put(
        path=reverse('update_review', kwargs={'review_id': uuid.uuid4()}) # UUID doesn't matter as not authorized will be first
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED

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
    response = api_client.put(
        path=reverse('update_review', kwargs={'review_id': review.id}),
        data={
            "rating": 5,
            "content": "Test"
        }
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
def test_not_existing(api_client: APIClient, create_user):
    user = create_user
    api_client.force_authenticate(user=user)
    response = api_client.put(
        path=reverse('update_review', kwargs={'review_id': uuid.uuid4()}),
        data={
            "rating": 5,
            "content": "Test"
        }
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.django_db
@pytest.mark.parametrize("rating,content", [
    ("", ""),
    (-1, ""),
    ("lll", "test"),
    (-1, "test"),
    (20, "test"),
    (20, 20),
    ("test", "test")])
def test_bad_request(api_client: APIClient, create_user, rating, content):
    user = create_user

    review = Review.objects.create(
        author=user,
        profile=user.profile,
        rating=5,
        content="Good"
    )

    api_client.force_authenticate(user=user)
    response = api_client.put(
        path=reverse('update_review', kwargs={'review_id': review.id}),
        data={
            "rating": rating,
            "content": content
        }
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_bad_fields(api_client, create_user):
    user = create_user
    review = Review.objects.create(
        author=user,
        profile=user.profile,
        rating=5,
        content="Good"
    )

    api_client.force_authenticate(user=user)
    response = api_client.put(
        path=reverse('update_review', kwargs={'review_id': review.id}),
        data={
            "rating": 3,
            "content": "content",
            "author": str(uuid.uuid4()),
            "bad_field": "test",
        }
    )

    # Check if author was not modified and all fields are correct
    modified = Review.objects.filter(author=user)
    assert modified.exists()
    assert modified.first().rating == 3
    assert modified.first().content == "content"
    assert response.status_code == status.HTTP_200_OK