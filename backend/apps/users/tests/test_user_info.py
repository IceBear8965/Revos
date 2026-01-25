from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from ..models import User


class UserInfoTest(APITestCase):
    def setUp(self):
        self.url = reverse("me")

    def test_user_info_api_normal(self):
        user = User.objects.create(
            email="test@example.com", nickname="TestUser", timezone="Europe/Berlin"
        )
        access = RefreshToken.for_user(user).access_token

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data.get("user_id"), user.id)
        self.assertEqual(response.data.get("email"), user.email)
        self.assertEqual(response.data.get("nickname"), user.nickname)
        self.assertEqual(response.data.get("timezone"), user.timezone)

    def test_user_info_api_unauthorized(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
