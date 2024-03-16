from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from . import views
from .serializers import MyTokenObtainPairView

urlpatterns = [
    path("", views.get_routes, name="get_routes"),
    #
    path("token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", views.register_user, name="register_user"),
    #
    path("profile/", views.get_profile, name="profile"),
    path("profile/feed", views.get_profile_feed, name="profile"),
    path("profile/visit/<uuid:profile_id>/", views.visit_profile, name="profile_visit"),
    path("profile/get_avatar/<uuid:profile_id>", views.get_profile_picture, name="profile_picture"),
]
