from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from . import views

urlpatterns = [
    path("", views.get_routes, name="get_routes"),
    #
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", views.register_user, name="register_user"),
    #
    path("profile/", views.get_profile, name="profile"),
    path("profile/<uuid:profile_id>/", views.get_profile, name="profile_visit"),
]
