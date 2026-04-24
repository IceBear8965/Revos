from datetime import datetime, timedelta
from datetime import timezone as dt_timezone

from django.shortcuts import get_object_or_404
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework import serializers, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
)
from rest_framework.views import APIView

from apps.common.loggers import log_event
from apps.energy.services import edit_energy_event
from apps.energy.services.activity_types import create_activity_type

from .models import ActivityType, EnergyEvent
from .serializers import (
    ActivityTypeCollectionSerializer,
    ActivityTypeCreateSerializer,
    ActivityTypeEditSerializer,
    BaseStatisticsSerializer,
    EnergyDashboardSerializer,
    EnergyEventCreateSerializer,
    EnergyEventEditSerializer,
    EventItemSerializer,
)
from .services.activity_types.create_activity_type import create_activity_type
from .services.create_energy_event import create_energy_event
from .services.dashboard import generate_dashboard
from .services.edit_energy_event import edit_energy_event
from .services.statistics.activities_summary import generate_activities_summary
from .services.statistics.energy_overview import generate_energy_overview


@extend_schema(
    request=EnergyEventCreateSerializer,
    responses={201: {"type": "object", "properies": {"status": "event_created"}}},
    description="Create new load or recovery event",
    summary="Create energy event",
)
class EnergyEventCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = EnergyEventCreateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        create_energy_event(user=request.user, **serializer.validated_data)

        log_event(
            action="event_created",
            user_id=request.user.id,
            extra={},
        )
        return Response({"status": "event_created"}, status=201)


@extend_schema(
    request=EnergyEventEditSerializer,
    responses={201: {"type": "object", "properies": {"status": "event_edited"}}},
    description="Edit energy event with history recalculation",
    summary="Edit energy event",
)
class EnergyEventEditView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        serializer = EnergyEventEditSerializer(
            data=request.data,
            context={"request": request, "view": self},
        )
        serializer.is_valid(raise_exception=True)

        edit_energy_event(
            user=request.user,
            id=id,
            **serializer.validated_data,
        )

        log_event(
            action="event_edited",
            user_id=request.user.id,
            extra={},
        )
        return Response({"status": "event_edited"}, status=HTTP_200_OK)


class EnergyEventDelteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        event = get_object_or_404(
            EnergyEvent,
            id=id,
            user=request.user,
        )

        event.delete()

        log_event(
            action="event deleted",
            user_id=request.user.id,
            extra={},
        )
        return Response(status=HTTP_204_NO_CONTENT)


# Returns user`s activities collection and creates new activity type
class ActivityTypesView(APIView):
    permission_classes = [IsAuthenticated]

    # GET /activity_types/
    def get(self, request):
        activities = ActivityType.objects.filter(user=request.user)
        serializer = ActivityTypeCollectionSerializer(instance=activities, many=True)
        return Response(serializer.data, status=HTTP_200_OK)

    # POST /activity_types/
    def post(self, request):
        serializer = ActivityTypeCreateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        create_activity_type(user=request.user, activity=data)

        log_event(
            action="new activity type created",
            user_id=request.user.id,
            extra={
                "activity_type": data["name"],
                "category": data["category"],
                "value": data["value"],
            },
        )
        return Response({"status": "new activity type created"}, status=HTTP_200_OK)


# Controls user`s activities
class ActivityTypeView(APIView):
    permission_classes = [IsAuthenticated]

    # Probably isn't really necessary
    # GET /activity_type/<id>/
    def get(self, request, id):
        pass

    # Change some activity type(name, value, category)
    # PATCH /activity_type/<id>/
    def patch(self, request, id):
        activity = get_object_or_404(ActivityType, id=id, user=request.user)

        serializer = ActivityTypeEditSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        for field, value in serializer.validated_data.items():
            setattr(activity, field, value)

        activity.save()

        log_event(
            action="activity_type edited",
            user_id=request.user.id,
            extra={
                "new_activity_type": activity.name,
                "new_category": activity.category,
                "new_value": activity.value,
            },
        )

        return Response(status=HTTP_200_OK)

    # DELETE /activity_type/<id>/
    def delete(self, request, id):
        activity = get_object_or_404(
            ActivityType,
            id=id,
            user=request.user,
        )

        if not activity.is_editable:
            return Response(
                {"detail": "This activity type cannot be deleted"}, status=HTTP_400_BAD_REQUEST
            )

        activity_type = activity.name
        activity.delete()

        log_event(
            action="activity type deleted",
            user_id=request.user.id,
            extra={"activity_type": activity_type},
        )
        return Response(status=HTTP_204_NO_CONTENT)


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
    permission_classes = [IsAuthenticated]

    def get(self, request):
        date_str = request.query_params.get("date")

        if not date_str:
            raise ValidationError({"date": "This field is required"})

        try:
            date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            raise ValidationError({"date": "Invalid format. Use YYYY-MM-DD"})

        start = datetime.combine(date, datetime.min.time()).replace(tzinfo=dt_timezone.utc)
        end = start + timedelta(days=1)

        events = EnergyEvent.objects.filter(
            user=request.user,
            started_at__lt=end,
            ended_at__gt=start,
        ).order_by("-started_at")

        serializer = EventItemSerializer(events, many=True)

        has_prev = (
            EnergyEvent.objects.filter(user=request.user, started_at__lt=start)
            .exclude(event_type="system")
            .exists()
        )
        has_next = EnergyEvent.objects.filter(user=request.user, started_at__gte=end).exists()

        return Response(
            {
                "date": date_str,
                "has_prev": has_prev,
                "has_next": has_next,
                "results": serializer.data,
            }
        )


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
    permission_classes = [IsAuthenticated]

    def get(self, request):
        statistics = {
            "energy_overview": generate_energy_overview(user=request.user),
            "activities_summary": generate_activities_summary(user=request.user),
        }

        serializer = BaseStatisticsSerializer(instance=statistics)

        return Response(serializer.data)
