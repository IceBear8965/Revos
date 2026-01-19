from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.energy.services.dashboard import generate_dashboard_content

User = get_user_model()


def create_user_with_energy(email: str, energy: float):
    """
    Helper: создаёт пользователя и обновляет его EnergyProfile.
    EnergyProfile уже создается сигналом при создании пользователя,
    поэтому мы просто меняем current_energy.
    """
    user = User.objects.create_user(email=email, password="123456")
    profile = user.energy_profile
    profile.current_energy = energy
    profile.save()
    profile.refresh_from_db()
    user.energy_profile.refresh_from_db()
    return user


class DashboardContentTests(TestCase):
    """
    Параметризованные тесты для generate_dashboard_content.
    Проверяем title, content и recommendation для разных energy states и контекстов.
    """

    def test_dashboard_messages(self):
        test_cases = [
            # LOW ENERGY
            {
                "energy": 0.1,
                "last_event": None,
                "expected": {
                    "title": "Low energy",
                    "content": "Your current energy level is quite low",
                    "recommendation": "Start with some rest",
                },
            },
            {
                "energy": 0.1,
                "last_event": type("Event", (), {"event_type": "load"})(),
                "expected": {
                    "title": "Overloaded",
                    "content": "You’ve been under heavy load recently",
                    "recommendation": "Start with some rest",
                },
            },
            {
                "energy": 0.1,
                "last_event": type("Event", (), {"event_type": "recovery"})(),
                "expected": {
                    "title": "Still tired",
                    "content": "Even after rest, your energy is still low",
                    "recommendation": "Start with some rest",
                },
            },
            # BELOW ENERGY
            {
                "energy": 0.35,
                "last_event": None,
                "expected": {
                    "title": "Feeling tired",
                    "content": "Your energy is slightly below average",
                    "recommendation": "Consider a short pause",
                },
            },
            {
                "energy": 0.35,
                "last_event": type("Event", (), {"event_type": "load"})(),
                "expected": {
                    "title": "A bit tired",
                    "content": "Recent activity drained some of your energy",
                    "recommendation": "Consider a short pause",
                },
            },
            {
                "energy": 0.35,
                "last_event": type("Event", (), {"event_type": "recovery"})(),
                "expected": {
                    "title": "Recovering",
                    "content": "You’re slowly regaining energy",
                    "recommendation": "Consider a short pause",
                },
            },
            # OK STATE
            {
                "energy": 0.65,
                "last_event": None,
                "expected": {
                    "title": "Stable energy",
                    "content": "Your energy level is in a comfortable range",
                    "recommendation": "You can continue your tasks",
                },
            },
            {
                "energy": 0.65,
                "last_event": type("Event", (), {"event_type": "load"})(),
                "expected": {
                    "title": "Work accounted for",
                    "content": "Your energy decreased, but you’re still okay",
                    "recommendation": "You can continue your tasks",
                },
            },
            {
                "energy": 0.65,
                "last_event": type("Event", (), {"event_type": "recovery"})(),
                "expected": {
                    "title": "Good recovery",
                    "content": "Rest helped you regain energy",
                    "recommendation": "You can continue your tasks",
                },
            },
            # HIGH ENERGY
            {
                "energy": 0.95,
                "last_event": None,
                "expected": {
                    "title": "Excellent energy",
                    "content": "Your energy level is very high",
                    "recommendation": "Great time for challenging tasks",
                },
            },
            {
                "energy": 0.95,
                "last_event": type("Event", (), {"event_type": "load"})(),
                "expected": {
                    "title": "Still energetic",
                    "content": "You still have plenty of energy left",
                    "recommendation": "Great time for challenging tasks",
                },
            },
            {
                "energy": 0.95,
                "last_event": type("Event", (), {"event_type": "recovery"})(),
                "expected": {
                    "title": "Fully charged",
                    "content": "You’ve recovered well and are ready for more",
                    "recommendation": "Great time for challenging tasks",
                },
            },
        ]

        for case in test_cases:
            with self.subTest(energy=case["energy"], context=getattr(case["last_event"], "event_type", None)):
                # ARRANGE
                user = create_user_with_energy(
                    email=f"user_{case['energy']}_{getattr(case['last_event'], 'event_type', 'first')}@example.com",
                    energy=case["energy"],
                )
                last_event = case["last_event"]

                # ACT
                message, recommendation = generate_dashboard_content(user=user, last_event=last_event)

                # ASSERT
                self.assertEqual(message["title"], case["expected"]["title"])
                self.assertEqual(message["content"], case["expected"]["content"])
                self.assertEqual(recommendation, case["expected"]["recommendation"])
