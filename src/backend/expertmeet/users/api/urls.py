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
    path("user/get_basic_info/<int:user_id>", views.get_basic_info, name="get_basic_info"),
]
