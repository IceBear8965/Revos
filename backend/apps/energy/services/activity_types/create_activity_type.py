from apps.energy.models import ActivityType


def create_activity_type(*, user, activity):
    ActivityType.objects.create(
        user=user,
        category=activity["category"],
        name=activity["name"],
        value=activity["value"],
        is_custom=True,
        is_editable=True,
    )
