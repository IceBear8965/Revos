from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from ..models import User


class ChangeTimezoneAPITest(APITestCase):
    def setUp(self):
        self.url = reverse("change-timezone")
        self.valid_payload = {"timezone": "Europe/Paris"}

    def test_change_timezone_normal(self):
        user = User.objects.create(
            email="test@example.com", nickname="TestUser", timezone="Europe/Berlin"
        )
        access = RefreshToken.for_user(user).access_token

        old_email = user.email
        old_nickname = user.nickname

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        request = self.client.patch(self.url, self.valid_payload, format="json")

        self.assertEqual(request.status_code, status.HTTP_202_ACCEPTED)
        user.refresh_from_db()
        self.assertEqual(user.timezone, self.valid_payload["timezone"])
        self.assertEqual(user.email, old_email)
        self.assertEqual(user.nickname, old_nickname)

    def test_change_timezone_wrong_timezone(self):
        payload = {"timezone": "Europe/_"}

        user = User.objects.create(
            email="test@example.com", nickname="TestUser", timezone="Europe/Berlin"
        )
        access = RefreshToken.for_user(user).access_token

        old_timezone = user.timezone
        old_email = user.email
        old_nickname = user.nickname

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        request = self.client.patch(self.url, payload, format="json")

        self.assertEqual(request.status_code, status.HTTP_400_BAD_REQUEST)
        user.refresh_from_db()
        self.assertEqual(user.timezone, old_timezone)
        self.assertEqual(user.email, old_email)
        self.assertEqual(user.nickname, old_nickname)

    def test_change_timezone_unauthorized(self):
        request = self.client.patch(self.url, self.valid_payload, format="json")

        self.assertEqual(request.status_code, status.HTTP_401_UNAUTHORIZED)
