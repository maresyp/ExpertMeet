from django.urls import path

from . import views

urlpatterns = [
    path("profile/", views.get_profile, name="profile"),
    path("profile/update", views.update_profile, name="update_profile"),
    path("profile/change_password", views.change_password, name="change_password"),
    #
    path("profile/feed", views.get_profile_feed, name="profile feed"),
    path("profile/reviews/feed/<uuid:profile_id>", views.get_reviews_feed, name="reviews feed"),
    #
    path("profile/visit/<uuid:profile_id>/", views.visit_profile, name="profile_visit"),
    #
    path("profile/get_avatar/<uuid:profile_id>", views.get_profile_picture, name="profile_picture"),
    path("profile/get_avatar_by_user/<int:user_id>", views.get_profile_picture_by_user, name="profile_picture_by_user"),
    path("profile/get_profile_uuid/<int:user_id>", views.get_profile_uuid, name="get_profile_uuid"),
    path("profile/get_review_summary/<uuid:profile_id>", views.get_review_summary, name="get_review_summary"),
    #
    path("profile/add_review/<uuid:profile_id>", views.add_review, name="add_review"),
    path("profile/delete_review/<uuid:review_id>", views.delete_review, name="delete_review"),
    path("profile/update_review/<uuid:review_id>", views.update_review, name="update_review"),
    #
    path("profile/get_categories", views.get_profile_categories, name="get_profile_categories"),
]
