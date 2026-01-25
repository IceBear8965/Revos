import pytz
from django.urls import reverse
from django.utils.dateparse import parse_datetime
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.models import User

from ..models import ActivityType, EnergyEvent, PersonalActivityProfile
from ..services.apply_energy_event import apply_energy_event


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


class EditEventAPITest(APITestCase):
    def setUp(self):
        setup_activity_types()
        self.url = reverse("edit-last-energy-event")
        self.valid_payload = {
            "activity_type": "work",
            "started_at": "2026-01-16T11:20:00",
            "ended_at": "2026-01-16T12:50:43",
            "subjective_coef": 0.8,
        }

    def generate_events(self, user):
        base_events = [
            {
                "activity_type": "work",
                "started_at": "2026-01-16T11:20:00",
                "ended_at": "2026-01-16T12:50:43",
                "subjective_coef": 0.8,
            },
            {
                "activity_type": "study",
                "started_at": "2026-01-16T13:00:00",
                "ended_at": "2026-01-16T14:30:00",
                "subjective_coef": 0.7,
            },
            {
                "activity_type": "sleep",
                "started_at": "2026-01-16T23:00:00",
                "ended_at": "2026-01-17T07:00:00",
                "subjective_coef": 1.0,
            },
        ]

        for event in base_events:
            apply_energy_event(
                user=user,
                activity_type=event["activity_type"],
                started_at=parse_datetime(event["started_at"]).replace(tzinfo=pytz.UTC),
                ended_at=parse_datetime(event["ended_at"]).replace(tzinfo=pytz.UTC),
                subjective_coef=event["subjective_coef"],
            )

    def test_edit_last_event_normal(self):
        """Проверяем успешное изменение последнего события"""
        user, access = create_user()
        self.generate_events(user)

        events_before = list(EnergyEvent.objects.filter(user=user))
        last_event = EnergyEvent.objects.filter(user=user).order_by("-created_at").first()
        self.valid_payload["event_id"] = last_event.id
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        response = self.client.post(self.url, self.valid_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Старое событие удалено
        self.assertFalse(EnergyEvent.objects.filter(id=last_event.id).exists())

        # Количество событий осталось тем же
        self.assertEqual(EnergyEvent.objects.filter(user=user).count(), len(events_before))

        # Новое событие создано
        new_event = EnergyEvent.objects.filter(user=user).order_by("-created_at").first()
        self.assertNotEqual(new_event.id, last_event.id)
        self.assertEqual(new_event.activity_type, self.valid_payload["activity_type"])

        # Проверка времени
        self.assertEqual(
            new_event.started_at,
            parse_datetime(self.valid_payload["started_at"]).replace(tzinfo=pytz.UTC),
        )
        self.assertEqual(
            new_event.ended_at,
            parse_datetime(self.valid_payload["ended_at"]).replace(tzinfo=pytz.UTC),
        )

    def test_edit_event_not_last(self):
        """Попытка редактирования не последнего события"""
        user, access = create_user()
        self.generate_events(user)

        second_event = EnergyEvent.objects.filter(user=user).order_by("started_at")[1]
        self.valid_payload["event_id"] = second_event.id
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        response = self.client.post(self.url, self.valid_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("detail", response.data)  # DRF по умолчанию кладёт сообщение в detail

    def test_edit_event_no_events(self):
        """Попытка редактирования при отсутствии событий"""
        user, access = create_user()

        self.valid_payload["event_id"] = 999
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        response = self.client.post(self.url, self.valid_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("detail", response.data)
