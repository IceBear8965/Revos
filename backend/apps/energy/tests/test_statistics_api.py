import pytz
from django.http import request
from django.urls import reverse
from django.utils.dateparse import parse_datetime
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.models import User

from ..models import ActivityType, EnergyEvent, EnergyProfile, PersonalActivityProfile
from ..services.apply_energy_event import apply_energy_event


def create_user():
    user = User.objects.create(
        email="test@example.com", nickname="TestUser", timezone="Europe/Kyiv"
    )
    PersonalActivityProfile.objects.create(
        user=user, load_order=["study", "work", "society", "sport"]
    )
    EnergyProfile.objects.create(user=user, current_energy=1.0)
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


class StatisticsAPITest(APITestCase):
    def setUp(self):
        setup_activity_types()
        self.url = reverse("statistics")

    def setup_energy_events(self, user):
        started_at = parse_datetime("2026-01-20T10:00:00").replace(tzinfo=pytz.UTC)
        ended_at = parse_datetime("2026-01-20T11:00:00").replace(tzinfo=pytz.UTC)
        apply_energy_event(
            user=user,
            activity_type="work",
            started_at=started_at,
            ended_at=ended_at,
            subjective_coef=0.8,
        )

        started_at = parse_datetime("2026-01-21T14:00:00").replace(tzinfo=pytz.UTC)
        ended_at = parse_datetime("2026-01-21T15:30:00").replace(tzinfo=pytz.UTC)
        apply_energy_event(
            user=user,
            activity_type="sleep",
            started_at=started_at,
            ended_at=ended_at,
            subjective_coef=1.0,
        )

        started_at = parse_datetime("2026-01-25T13:00:00").replace(tzinfo=pytz.UTC)
        ended_at = parse_datetime("2026-01-25T14:00:00").replace(tzinfo=pytz.UTC)
        apply_energy_event(
            user=user,
            activity_type="sport",
            started_at=started_at,
            ended_at=ended_at,
            subjective_coef=0.7,
        )

    def test_statistics_normal(self):
        user, access = create_user()

        self.setup_energy_events(user=user)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        request = self.client.get(self.url)

        self.assertEqual(request.status_code, status.HTTP_200_OK)
        self.assertIn("energy_overview", request.data)
        self.assertEqual(len(request.data["energy_overview"]["activities"]), 7)

        dates = {item["date"] for item in request.data["energy_overview"]["activities"]}

        self.assertIn("2026-01-20", dates)
        self.assertIn("2026-01-21", dates)
        self.assertIn("2026-01-25", dates)

        energy_by_date = {
            item["date"]: item["energy"] for item in request.data["energy_overview"]["activities"]
        }

        self.assertIsNotNone(energy_by_date["2026-01-20"])
        self.assertIsNotNone(energy_by_date["2026-01-21"])
        self.assertIsNotNone(energy_by_date["2026-01-25"])

        self.assertIsNone(energy_by_date["2026-01-19"])
        self.assertIsNone(energy_by_date["2026-01-22"])

        self.assertIn("activities_summary", request.data)
        self.assertIn("period", request.data["activities_summary"])
        self.assertIn("scale", request.data["activities_summary"])
        self.assertIn("activities", request.data["activities_summary"])
        self.assertEqual(len(request.data["activities_summary"]["activities"]), 3)

    def test_statistics_empty(self):
        user, access = create_user()

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        request = self.client.get(self.url)

        self.assertEqual(request.status_code, status.HTTP_200_OK)
        self.assertIn("energy_overview", request.data)

        self.assertIn("activities_summary", request.data)
        self.assertEqual(len(request.data["activities_summary"]["activities"]), 0)

    def test_statistics_only_current_user(self):
        user1, access1 = create_user()
        self.setup_energy_events(user1)
        # user1 events: 20, 21, 25

        user2 = User.objects.create(
            email="other@example.com",
            nickname="OtherUser",
            timezone="Europe/Kyiv",
        )
        PersonalActivityProfile.objects.create(
            user=user2, load_order=["study", "work", "society", "sport"]
        )
        EnergyProfile.objects.create(user=user2, current_energy=1.0)

        apply_energy_event(
            user=user2,
            activity_type="work",
            started_at=parse_datetime("2026-01-22T10:00:00").replace(tzinfo=pytz.UTC),
            ended_at=parse_datetime("2026-01-22T11:00:00").replace(tzinfo=pytz.UTC),
            subjective_coef=0.8,
        )
        apply_energy_event(
            user=user2,
            activity_type="sleep",
            started_at=parse_datetime("2026-01-23T23:00:00").replace(tzinfo=pytz.UTC),
            ended_at=parse_datetime("2026-01-24T07:00:00").replace(tzinfo=pytz.UTC),
            subjective_coef=1.0,
        )

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access1}")
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        activities = response.data["energy_overview"]["activities"]
        energy_by_date = {item["date"]: item["energy"] for item in activities}

        self.assertIsNotNone(energy_by_date["2026-01-20"])
        self.assertIsNotNone(energy_by_date["2026-01-21"])
        self.assertIsNotNone(energy_by_date["2026-01-25"])

        self.assertIsNone(energy_by_date["2026-01-22"])
        self.assertIsNone(energy_by_date["2026-01-23"])

    def test_statistics_unauthorized(self):
        request = self.client.get(self.url)

        self.assertEqual(request.status_code, status.HTTP_401_UNAUTHORIZED)
