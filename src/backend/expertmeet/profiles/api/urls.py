from django.urls import path

from . import views

urlpatterns = [
    path("profile/", views.get_profile, name="profile"),
    path("profile/feed", views.get_profile_feed, name="profile"),
    path("profile/visit/<uuid:profile_id>/", views.visit_profile, name="profile_visit"),
    path("profile/get_avatar/<uuid:profile_id>", views.get_profile_picture, name="profile_picture"),
]
