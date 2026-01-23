from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.energy.constants import LOAD_ACTIVITIES
from apps.energy.models import EnergyProfile, PersonalActivityProfile
from apps.users.models import User


class RegisterUserAPITest(APITestCase):
    def setUp(self):
        self.url = reverse("register")  # или жёстко "/api/users/register/"

        self.valid_payload = {
            "email": "test@example.com",
            "password": "strongpassword",
            "nickname": "TestUser",
            "initial_energy_state": "normal",
            "timezone": "Europe/Berlin",
            "load_order": LOAD_ACTIVITIES,
        }

    def test_register_user_success(self):
        response = self.client.post(self.url, self.valid_payload, format="json")

        # --- HTTP ---
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # --- tokens ---
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

        # --- user created ---
        self.assertEqual(User.objects.count(), 1)
        user = User.objects.get(email="test@example.com")

        self.assertEqual(user.nickname, "TestUser")
        self.assertEqual(user.timezone, "Europe/Berlin")
        self.assertTrue(user.check_password("strongpassword"))

        # --- energy profile created ---
        self.assertTrue(EnergyProfile.objects.filter(user=user).exists())

        # --- personal activity profile created ---
        personal_profile = PersonalActivityProfile.objects.get(user=user)
        self.assertEqual(personal_profile.load_order, LOAD_ACTIVITIES)

    def test_register_user_wrong_email(self):
        payload = self.valid_payload.copy()
        payload["email"] = "wrong_email"

        response = self.client.post(self.url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_register_user_wrong_password(self):
        payload = self.valid_payload.copy()
        payload["password"] = "123456"

        response = self.client.post(self.url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_register_user_wrong_timezone(self):
        payload = self.valid_payload.copy()
        payload["timezone"] = "Europe/_"

        response = self.client.post(self.url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("timezone", response.data)

    def test_register_user_wrong_loads(self):
        payload = self.valid_payload.copy()
        payload["load_order"] = ["study", "society", "work"]

        response = self.client.post(self.url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("load_order", response.data)

    def test_register_user_wrong_state(self):
        payload = self.valid_payload.copy()
        payload["initial_energy_state"] = "smth"

        response = self.client.post(self.url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("initial_energy_state", response.data)

    def test_register_user_empty(self):
        payload = {
            "email": "123456@example.com",
            "password": "123456",
        }

        response = self.client.post(self.url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
