import pytz
import rest_framework
from django.http import request
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
)
from rest_framework.views import APIView

from apps.common.loggers import log_event

from .domain.errors import (
    ActivityTypeNotFound,
    EnergyDomainError,
)
from .models import PersonalActivityProfile
from .serializers import (
    BaseStatisticsSerializer,
    EnergyDashboardSerializer,
    EnergyEventCreateSerializer,
    EnergyEventEditSerializer,
    EventsListSerializer,
    PersonalActivityOrderSerializer,
)
from .services.apply_energy_event import apply_energy_event
from .services.dashboard import generate_dashboard
from .services.edit_energy_event import edit_energy_event
from .services.events_list import generate_events_list
from .services.statistics.activities_summary import generate_activities_summary
from .services.statistics.energy_overview import generate_energy_overview


@extend_schema(
    request=EnergyEventCreateSerializer,
    responses={
        201: {
            "type": "object",
            "properties": {
                "id": {"type": "number", "description": "New event id"},
                "activity_type": {"type": "string", "description": "Activity type"},
                "event_type": {"type": "string", "description": "Event type(load/recovery)"},
                "started_at": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Event time of start",
                },
                "ended_at": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Event time of end",
                },
                "energy_before": {
                    "type": "number",
                    "format": "float",
                    "description": "User energy before this event",
                },
                "energy_delta": {
                    "type": "number",
                    "format": "float",
                    "description": "Energy delta",
                },
                "energy_after": {
                    "type": "number",
                    "format": "float",
                    "description": "User energy after this event",
                },
            },
        }
    },
    description="Create new load or recovery event",
    summary="Create energy event",
)
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
                "subjective_coef": event.subjective_coef,
            },
            status=HTTP_201_CREATED,
        )


@extend_schema(
    request=EnergyEventEditSerializer,
    responses={
        200: {
            "type": "object",
            "properties": {
                "id": {"type": "number", "description": "New event id"},
                "activity_type": {"type": "string", "description": "Activity type"},
                "event_type": {"type": "string", "description": "Event type(load/recovery)"},
                "started_at": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Event time of start",
                },
                "ended_at": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Event time of end",
                },
                "energy_before": {
                    "type": "number",
                    "format": "float",
                    "description": "User energy before this event",
                },
                "energy_delta": {
                    "type": "number",
                    "format": "float",
                    "description": "Energy delta",
                },
                "energy_after": {
                    "type": "number",
                    "format": "float",
                    "description": "User energy after this event",
                },
            },
        }
    },
    description="Edit last energy event",
    summary="Edit last energy event",
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
                "subjective_coef": event.subjective_coef,
            },
            status=HTTP_200_OK,
        )


@extend_schema(
    request=EnergyDashboardSerializer,
    responses={
        200: {
            "type": "object",
            "properties": {
                "greeting": {"type": "string", "description": "Personal user greeting"},
                "current_energy": {
                    "type": "number",
                    "format": "float",
                    "description": "User's current energy level (0.0-1.0)",
                },
                "message": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string", "description": "Info message title"},
                        "content": {"type": "string", "description": "Info message"},
                    },
                },
                "recommendation": {
                    "type": "string",
                    "description": "Personalized recommendation for user",
                },
                "last_event": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "number", "description": "Last user energy event id"},
                        "event_type": {
                            "type": "string",
                            "description": "Event type(load or recovery)",
                        },
                        "activity_type": {"type": "string", "description": "Activity type"},
                        "started_at": {
                            "type": "string",
                            "format": "date-time",
                            "description": "Event start time",
                        },
                        "ended_at": {
                            "type": "string",
                            "format": "date-time",
                            "description": "Event end time",
                        },
                        "energy_delta": {
                            "type": "number",
                            "format": "float",
                            "description": "Energy delta of the last energy event",
                        },
                        "subjective_coef": {
                            "type": "number",
                            "format": "float",
                            "description": "Subjective assessment of the last event",
                        },
                    },
                },
            },
        }
    },
    description="Main screen dashboard with common data",
    summary="User dashboard",
)
class EnergyDashboardView(APIView):
    def get(self, request):
        user = request.user
        dashboard = generate_dashboard(user=user)
        serializer = EnergyDashboardSerializer(instance=dashboard)
        dashboard = serializer.data
        return Response(dashboard, status=HTTP_200_OK)


@extend_schema(
    request=None,
    responses={
        200: {
            "type": "object",
            "properties": {
                "results": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "event_id": {"type": "integer"},
                            "event_type": {"type": "string"},
                            "activity_type": {"type": "string"},
                            "started_at": {"type": "string", "format": "date-time"},
                            "ended_at": {"type": "string", "format": "date-time"},
                            "energy_delta": {"type": "number"},
                        },
                    },
                }
            },
        }
    },
    description="Returns list of all energy events for the authenticated user",
    summary="User energy events list",
)
class EventsListView(APIView):
    def get(self, request):
        user = request.user
        events_list = generate_events_list(user=user)
        serializer = EventsListSerializer(instance=events_list)
        events_list = serializer.data
        return Response(events_list, status=HTTP_200_OK)


@extend_schema(
    request=None,
    responses={
        200: {
            "type": "object",
            "properties": {
                "energy_overview": {
                    "type": "object",
                    "properties": {
                        "period": {
                            "type": "object",
                            "properties": {
                                "type": {"type": "string"},
                                "from": {"type": "string", "format": "date"},
                                "to": {"type": "string", "format": "date"},
                            },
                        },
                        "activities": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "date": {"type": "string", "format": "date"},
                                    "energy": {"type": "number", "nullable": True},
                                },
                            },
                        },
                    },
                },
                "activities_summary": {
                    "type": "object",
                    "properties": {
                        "period": {
                            "type": "object",
                            "properties": {
                                "type": {"type": "string"},
                                "from": {"type": "string", "format": "date"},
                                "to": {"type": "string", "format": "date"},
                            },
                        },
                        "scale": {
                            "type": "object",
                            "properties": {
                                "min": {"type": "number"},
                                "max": {"type": "number"},
                            },
                        },
                        "activities": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "activity_type": {"type": "string"},
                                    "avg_energy_delta": {"type": "number"},
                                    "event_count": {"type": "integer"},
                                },
                            },
                        },
                    },
                },
            },
        }
    },
    description="Returns weekly energy overview and summary of user's activities",
    summary="User energy statistics",
)
class BaseStatisticsView(APIView):
    def get(self, request):
        user = request.user
        energy_overview = generate_energy_overview(user=user)
        activities_summary = generate_activities_summary(user=user)
        statistics = {"energy_overview": energy_overview, "activities_summary": activities_summary}
        serializer = BaseStatisticsSerializer(instance=statistics)
        statistics = serializer.data
        return Response(statistics, status=HTTP_200_OK)


@extend_schema(
    request=PersonalActivityOrderSerializer,
    responses={
        200: {
            "load_order": {
                "type": "array",
                "description": "Sequnce of user's personal coef",
            }
        }
    },
    description="Changes user's load activities coef",
    summary="Adjust personal_coef",
)
class PersonalActivityOrderView(APIView):
    def patch(self, request):
        serializer = PersonalActivityOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        profile, _ = PersonalActivityProfile.objects.get_or_create(user=request.user)

        profile.load_order = serializer.validated_data["load_order"]
        profile.save(update_fields=["load_order"])

        log_event(
            action="personal_coef_updated",
            user_id=request.user.id,
            extra={"new_load_order": profile.load_order},
        )

        return Response(
            {"load_order": profile.load_order},
            status=HTTP_200_OK,
        )
