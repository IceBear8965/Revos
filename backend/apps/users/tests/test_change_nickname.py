from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from ..models import User


class ChangeAPIsTest(APITestCase):
    def setUp(self):
        self.url = reverse("change-nickname")
        self.valid_payload = {"nickname": "NewNickname"}

    def test_change_nickname_normal(self):
        user = User.objects.create(
            email="test@example.com", nickname="TestUser", timezone="Europe/Berlin"
        )

        old_email = user.email
        old_timezone = user.timezone
        access = RefreshToken.for_user(user).access_token

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        request = self.client.patch(self.url, data=self.valid_payload, format="json")

        self.assertEqual(request.status_code, status.HTTP_202_ACCEPTED)
        user.refresh_from_db()
        self.assertEqual(user.nickname, self.valid_payload["nickname"])
        self.assertEqual(user.email, old_email)
        self.assertEqual(user.timezone, old_timezone)

    def test_change_nickname_empty(self):
        payload = {"nickname": ""}
        user = User.objects.create(
            email="test@example.com", nickname="TestUser", timezone="Europe/Berlin"
        )

        old_nickname = user.nickname
        old_email = user.email
        old_timezone = user.timezone
        access = RefreshToken.for_user(user).access_token

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        request = self.client.patch(self.url, data=payload, format="json")

        self.assertEqual(request.status_code, status.HTTP_400_BAD_REQUEST)
        user.refresh_from_db()
        self.assertEqual(user.nickname, old_nickname)
        self.assertEqual(user.email, old_email)
        self.assertEqual(user.timezone, old_timezone)

    def test_change_nickname_long(self):
        payload = {"nickname": "increadiblylongnickname1234567890"}
        user = User.objects.create(
            email="test@example.com", nickname="TestUser", timezone="Europe/Berlin"
        )

        old_nickname = user.nickname
        old_email = user.email
        old_timezone = user.timezone
        access = RefreshToken.for_user(user).access_token

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        request = self.client.patch(self.url, data=payload, format="json")

        self.assertEqual(request.status_code, status.HTTP_400_BAD_REQUEST)
        user.refresh_from_db()
        self.assertEqual(user.nickname, old_nickname)
        self.assertEqual(user.email, old_email)
        self.assertEqual(user.timezone, old_timezone)

    def test_change_nickname_unauthorized(self):
        payload = {"nickname": "increadiblylongnickname1234567890"}
        request = self.client.patch(self.url, data=payload, format="json")

        self.assertEqual(request.status_code, status.HTTP_401_UNAUTHORIZED)
