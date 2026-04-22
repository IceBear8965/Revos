from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import ChangeNicknameView, ChangeTimezoneView, MeView, RegisterUserView

urlpatterns = [
    path("", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegisterUserView.as_view(), name="register"),
    path("me/", MeView.as_view(), name="me"),
    path("change_nickname/", ChangeNicknameView.as_view(), name="change-nickname"),
    path("change_timezone/", ChangeTimezoneView.as_view(), name="change-timezone"),
]
