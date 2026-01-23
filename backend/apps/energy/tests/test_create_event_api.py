import pytz
from django.urls import reverse
from django.utils.dateparse import parse_datetime
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.models import User

from ..models import ActivityType, EnergyEvent, PersonalActivityProfile


def create_user():
    user = User.objects.create(
        email="test@example.com", nickname="TestUser", timezone="Europe/Kyiv"
    )
    PersonalActivityProfile.objects.create(
        user=user, load_order=["study", "work", "society", "sport"]
    )

    access = RefreshToken.for_user(user).access_token
    return user, access


def setup_activity_types():
    ActivityType.objects.create(code="work", category="load")
    ActivityType.objects.create(code="study", category="load")
    ActivityType.objects.create(code="sport", category="load")
    ActivityType.objects.create(code="society", category="load")
    ActivityType.objects.create(code="sleep", category="recovery")
    ActivityType.objects.create(code="rest", category="recovery")
    ActivityType.objects.create(code="walk", category="recovery")


class CreateEventAPITest(APITestCase):
    def setUp(self):
        setup_activity_types()
        self.url = reverse("create-energy-event")
        self.valid_payload_load = {
            "activity_type": "work",
            "started_at": "2026-01-16T11:20:00",
            "ended_at": "2026-01-16T12:50:43",
            "subjective_coef": "0.8",
        }
        self.valid_payload_recovery = {
            "activity_type": "walk",
            "started_at": "2026-01-18T19:00:00",
            "ended_at": "2026-01-18T20:50:00",
            "subjective_coef": "0.8",
        }

    def asser_energy_fields(self, data):
        for field in ("energy_before", "energy_delta", "energy_after"):
            self.assertIn(field, data)

    def test_create_event_load_normal(self):
        user, access = create_user()

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        request = self.client.post(self.url, self.valid_payload_load, format="json")

        self.assertEqual(request.status_code, status.HTTP_201_CREATED)
        self.assertEqual(EnergyEvent.objects.count(), 1)

        self.assertEqual(request.data["activity_type"], self.valid_payload_load["activity_type"])
        self.assertEqual(
            request.data["event_type"],
            ActivityType.objects.get(code=request.data["activity_type"]).category,
        )

        self.assertEqual(
            parse_datetime(request.data["started_at"]).astimezone(pytz.UTC),
            parse_datetime(self.valid_payload_load["started_at"]).replace(tzinfo=pytz.UTC),
        )
        self.assertEqual(
            parse_datetime(request.data["ended_at"]).astimezone(pytz.UTC),
            parse_datetime(self.valid_payload_load["ended_at"]).replace(tzinfo=pytz.UTC),
        )

        self.assertIn("energy_before", request.data)
        self.assertIn("energy_delta", request.data)
        self.assertIn("energy_after", request.data)

    def test_create_event_recovery_normal(self):
        user, access = create_user()

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        request = self.client.post(self.url, self.valid_payload_recovery, format="json")

        self.assertEqual(request.status_code, status.HTTP_201_CREATED)
        self.assertEqual(EnergyEvent.objects.count(), 1)

        self.assertEqual(
            request.data["activity_type"], self.valid_payload_recovery["activity_type"]
        )
        self.assertEqual(
            request.data["event_type"],
            ActivityType.objects.get(code=request.data["activity_type"]).category,
        )

        self.assertEqual(
            parse_datetime(request.data["started_at"]).astimezone(pytz.UTC),
            parse_datetime(self.valid_payload_recovery["started_at"]).replace(tzinfo=pytz.UTC),
        )
        self.assertEqual(
            parse_datetime(request.data["ended_at"]).astimezone(pytz.UTC),
            parse_datetime(self.valid_payload_recovery["ended_at"]).replace(tzinfo=pytz.UTC),
        )

        self.assertIn("energy_before", request.data)
        self.assertIn("energy_delta", request.data)
        self.assertIn("energy_after", request.data)

    def test_create_event_wrong_request(self):
        payload = {
            "started_at": "2026-01-16T11:20:00",
            "ended_at": "2026-01-16T12:50:43",
            "subjective_coef": "0.8",
        }
        user, access = create_user()

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        request = self.client.post(self.url, payload, format="json")

        self.assertEqual(request.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_event_unauthorized(self):
        request = self.client.post(self.url, self.valid_payload_load, format="json")

        self.assertEqual(request.status_code, status.HTTP_401_UNAUTHORIZED)
