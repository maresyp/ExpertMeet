import pytest

from profiles.models import Profile, ReviewSummary, Review

@pytest.mark.django_db
def test_profile_created(django_user_model):
    user = django_user_model.objects.create(
        username="test@test.com",
        password="test",
    )

    # Check that a profile has been created for the new user.
    assert Profile.objects.filter(user=user).exists()


@pytest.mark.django_db
def test_review_summary_created(django_user_model):
    user = django_user_model.objects.create(
        username="test@test.com",
        password="test",
    )

    # Check that a profile has been created for the new user.
    assert ReviewSummary.objects.filter(profile=user.profile).exists()


@pytest.mark.django_db
def test_review_created(django_user_model):
    issuer = django_user_model.objects.create(
        username="issuer@test.com",
        password="test",
    )

    receiver = django_user_model.objects.create(
        username="receiver@test.com",
        password="test",
    )

    # Note: This tests allows single user to create more than one review for given profile
    # this won't be allowed by api
    for _ in range(3):
        Review.objects.create(
            author=issuer,
            profile=receiver.profile,
            rating=4.0,
            content="Test"
        )

    summary = ReviewSummary.objects.filter(profile=receiver.profile).first()
    assert summary.ratings_count == 3
    assert summary.ratings_mean == 4.0

@pytest.mark.django_db
def test_user_delete(django_user_model):
    issuer = django_user_model.objects.create(
        username="issuer@test.com",
        password="test",
    )

    receiver = django_user_model.objects.create(
        username="receiver@test.com",
        password="test",
    )

    # Note: This tests allows single user to create more than one review for given profile
    # this won't be allowed by api
    for _ in range(3):
        Review.objects.create(
            author=issuer,
            profile=receiver.profile,
            rating=4.0,
            content="Test"
        )

    issuer.delete()

    # Check if after deletion of issuer Review Summary is correctly updated
    summary = ReviewSummary.objects.filter(profile=receiver.profile).first()
    assert summary.ratings_count == 0
    assert summary.ratings_mean == 0.0