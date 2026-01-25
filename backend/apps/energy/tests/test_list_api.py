import pytz
from django.urls import reverse
from django.utils.dateparse import parse_datetime
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.energy.models import ActivityType, EnergyProfile, PersonalActivityProfile
from apps.energy.services.apply_energy_event import apply_energy_event
from apps.users.models import User


def create_user(email="test@example.com"):
    user = User.objects.create(
        email=email,
        nickname="TestUser",
        timezone="Europe/Kyiv",
    )
    PersonalActivityProfile.objects.create(
        user=user,
        load_order=["study", "work", "society", "sport"],
    )
    EnergyProfile.objects.create(user=user, current_energy=1.0)
    access = RefreshToken.for_user(user).access_token
    return user, access


def setup_activity_types():
    ActivityType.objects.bulk_create(
        [
            ActivityType(code="work", category="load"),
            ActivityType(code="study", category="load"),
            ActivityType(code="sport", category="load"),
            ActivityType(code="society", category="load"),
            ActivityType(code="sleep", category="recovery"),
            ActivityType(code="rest", category="recovery"),
            ActivityType(code="walk", category="recovery"),
        ]
    )


def create_events(user):
    events = [
        ("work", "2026-01-20T10:00:00", "2026-01-20T11:00:00", 0.8),
        ("sleep", "2026-01-21T23:00:00", "2026-01-22T07:00:00", 1.0),
    ]

    for activity, start, end, coef in events:
        apply_energy_event(
            user=user,
            activity_type=activity,
            started_at=parse_datetime(start).replace(tzinfo=pytz.UTC),
            ended_at=parse_datetime(end).replace(tzinfo=pytz.UTC),
            subjective_coef=coef,
        )


class EnergyEventsListAPITest(APITestCase):
    def setUp(self):
        setup_activity_types()
        self.url = reverse("events_list")

    def test_list_events_normal(self):
        user, access = create_user()
        create_events(user)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        results = response.data["results"]
        self.assertGreaterEqual(len(results), 2)

        activity_types = {e["activity_type"] for e in results}
        self.assertIn("work", activity_types)
        self.assertIn("sleep", activity_types)

        for event in results:
            self.assertIn("event_id", event)
            self.assertIn("event_type", event)
            self.assertIn("started_at", event)
            self.assertIn("ended_at", event)
            self.assertIn("energy_delta", event)

    def test_list_events_only_current_user(self):
        user1, access1 = create_user("user1@example.com")
        user2, _ = create_user("user2@example.com")

        create_events(user1)
        create_events(user2)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access1}")
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        results = response.data["results"]
        self.assertGreater(len(results), 0)

        event_user_ids = {event["event_id"] for event in results}

        self.assertTrue(len(event_user_ids) > 0)

    def test_list_events_empty(self):
        user, access = create_user()

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"], [])

    def test_list_events_unauthorized(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
