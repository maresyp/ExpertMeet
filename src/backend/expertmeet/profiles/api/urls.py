from django.urls import path

from . import views

urlpatterns = [
    path("profile/", views.get_profile, name="profile"),
    #
    path("profile/feed", views.get_profile_feed, name="profile feed"),
    path("profile/reviews/feed/<uuid:profile_id>", views.get_reviews_feed, name="reviews feed"),
    #
    path("profile/visit/<uuid:profile_id>/", views.visit_profile, name="profile_visit"),
    #
    path("profile/get_avatar/<uuid:profile_id>", views.get_profile_picture, name="profile_picture"),
    path("profile/get_review_summary/<uuid:profile_id>", views.get_review_summary, name="get_review_summary"),
    #
    path("profile/add_review/<uuid:profile_id>", views.add_review, name="add_review"),
    path("profile/delete_review/<uuid:review_id>", views.delete_review, name="delete_review"),
    path("profile/update_review/<uuid:review_id>", views.update_review, name="update_review"),
]
