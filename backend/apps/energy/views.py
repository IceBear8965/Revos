import pytz
from django.utils import timezone
from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
)
from rest_framework.views import APIView

from .domain.errors import (
    ActivityTypeNotFound,
    EnergyDomainError,
    EventIsNotLast,
    LastEventNotFound,
)
from .serializers import (
    BaseStatisticsSerizlizer,
    EnergyDashboardSerializer,
    EnergyEventCreateSerializer,
    EnergyEventEditSerializer,
    EventsListSerializer,
)
from .services.apply_energy_event import apply_energy_event
from .services.dashboard import generate_dashboard
from .services.edit_energy_event import edit_energy_event
from .services.events_list import generate_events_list
from .services.statistics.activities_summary import generate_activities_summary
from .services.statistics.energy_overview import generate_energy_overview


class EnergyEventCreateView(APIView):
    def post(self, request):
        serializer = EnergyEventCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        tz = pytz.UTC
        validated_data["started_at"] = validated_data["started_at"].astimezone(tz)
        validated_data["ended_at"] = validated_data["ended_at"].astimezone(tz)

        try:
            event = apply_energy_event(user=request.user, **validated_data)
        except ActivityTypeNotFound as e:
            return Response(
                e.to_response(),
                status=e.status_code,
            )

        user_timezone = pytz.timezone(request.user.timezone)
        started_at_local = event.started_at.astimezone(user_timezone).isoformat()
        ended_at_local = event.ended_at.astimezone(user_timezone).isoformat()
        return Response(
            {
                "id": event.id,
                "activity_type": event.activity_type,
                "event_type": event.event_type,
                "started_at": started_at_local,
                "ended_at": ended_at_local,
                "energy_before": event.energy_before,
                "energy_after": event.energy_after,
                "energy_delta": event.energy_delta,
            },
            status=HTTP_201_CREATED,
        )


class EnergyEventEditView(APIView):
    def post(self, request):
        serializer = EnergyEventEditSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        tz = pytz.UTC
        validated_data["started_at"] = validated_data["started_at"].astimezone(tz)
        validated_data["ended_at"] = validated_data["ended_at"].astimezone(tz)

        try:
            event = edit_energy_event(
                user=request.user,
                **validated_data,
            )
        except EnergyDomainError as e:
            return Response(
                e.to_response(),
                status=e.status_code,
            )

        user_timezone = pytz.timezone(request.user.timezone)
        started_at_local = event.started_at.astimezone(user_timezone).isoformat()
        ended_at_local = event.ended_at.astimezone(user_timezone).isoformat()
        return Response(
            {
                "id": event.id,
                "activity_type": event.activity_type,
                "event_type": event.event_type,
                "started_at": started_at_local,
                "ended_at": ended_at_local,
                "energy_before": event.energy_before,
                "energy_after": event.energy_after,
                "energy_delta": event.energy_delta,
            }
        )


class EnergyDashboardView(APIView):
    def get(self, request):
        user = request.user
        dashboard = generate_dashboard(user=user)
        serializer = EnergyDashboardSerializer(instance=dashboard)
        dashboard = serializer.data
        return Response(dashboard, status=HTTP_200_OK)


# TODO: ADD PAGINATION
class EventsListView(APIView):
    def get(self, request):
        user = request.user
        events_list = generate_events_list(user=user)
        serializer = EventsListSerializer(instance=events_list)
        events_list = serializer.data
        return Response(events_list, status=HTTP_200_OK)


class BaseStatisticsView(APIView):
    def get(self, request):
        user = request.user
        energy_overview = generate_energy_overview(user=user)
        activities_summary = generate_activities_summary(user=user)
        statistics = {"energy_overview": energy_overview, "activities_summary": activities_summary}
        serializer = BaseStatisticsSerizlizer(instance=statistics)
        statistics = serializer.data
        return Response(statistics, status=HTTP_200_OK)
