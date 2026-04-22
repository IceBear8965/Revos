from datetime import timedelta

from apps.energy.models import EnergyEvent
from rest_framework import serializers


def validate_event_time(started_at, ended_at):
    if started_at >= ended_at:
        raise serializers.ValidationError({"ended_at": "ended_at must be greater than started_at"})

    duration = ended_at - started_at

    if duration < timedelta(minutes=5):
        raise serializers.ValidationError({"ended_at": "Event must be at least 5 minute long"})

    if duration > timedelta(hours=16):
        raise serializers.ValidationError({"ended_at": "Event can't be longer than 16 hours"})


def get_event_neighbors(user, event):
    """
    Returns previous and next events relative to the event being edited.
    """

    prev_event = (
        EnergyEvent.objects.filter(
            user=user,
            ended_at__lte=event.started_at,
        )
        .exclude(id=event.id)
        .order_by("-ended_at")
        .first()
    )

    next_event = (
        EnergyEvent.objects.filter(
            user=user,
            started_at__gte=event.ended_at,
        )
        .exclude(id=event.id)
        .order_by("started_at")
        .first()
    )

    return prev_event, next_event


def validate_event_edit(user, event_id, started_at, ended_at):
    try:
        event = EnergyEvent.objects.get(id=event_id, user=user)
    except EnergyEvent.DoesNotExist:
        raise serializers.ValidationError({"id": "Event not found"})

    prev_event, next_event = get_event_neighbors(user, event)

    if prev_event and started_at < prev_event.ended_at:
        raise serializers.ValidationError({"started_at": "Event overlaps with previous event"})

    if next_event and ended_at > next_event.started_at:
        raise serializers.ValidationError({"ended_at": "Event overlaps with next event"})
