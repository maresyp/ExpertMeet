import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from profiles.models import Review

@pytest.fixture
def api_client():
   return APIClient()

@pytest.fixture
def create_user(db, django_user_model):
    return django_user_model.objects.create_user(username="test@test.com", password="test")

@pytest.fixture
def url(create_user):
    return reverse('add_review', kwargs={'profile_id': create_user.profile.id})

@pytest.mark.django_db
@pytest.mark.parametrize("rating,content", [
    ("", ""),
    (-1, ""),
    ("lll", "test"),
    (-1, "test"),
    (20, "test"),
    (20, 20),
    ("test", "test")])
def test_bad_request(url, api_client: APIClient, create_user, rating, content ):
    user = create_user
    data = {rating: rating, content: content}

    api_client.force_authenticate(user=user)
    response = api_client.post(path=url, data=data)

    assert response.status_code  == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_not_authenticated(url, api_client: APIClient):
    response = api_client.post(path=url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_correct_request(api_client, create_user, django_user_model):
    user = create_user
    user2 = django_user_model.objects.create_user(username="test2@test.com", password="test")

    url = reverse("add_review", kwargs={"profile_id": user2.profile.id})
    data = {"rating": 5, "content": "Good"}

    api_client.force_authenticate(user=user)
    response = api_client.post(
        path=url,
        data=data,
    )

    assert response.status_code == status.HTTP_201_CREATED
    assert Review.objects.filter(profile=user2.profile.id).exists()

    rev = Review.objects.filter(profile=user2.profile.id).first()
    assert rev.rating == data['rating']
    assert rev.content == data['content']


@pytest.mark.django_db
def test_self_review(url, api_client: APIClient, create_user):
    user = create_user
    data = {"rating": 5, "content": "Good"}

    api_client.force_authenticate(user=user)
    response = api_client.post(path=url, data=data)

    assert response.status_code == status.HTTP_406_NOT_ACCEPTABLE


def test_double_review(url, api_client: APIClient, create_user):
    user = create_user
    data = {"rating": 5, "content": "Good"}
    api_client.force_authenticate(user=user)

    for _ in range(2):
        response = api_client.post(path=url, data=data)

    assert response.status_code == status.HTTP_406_NOT_ACCEPTABLE
