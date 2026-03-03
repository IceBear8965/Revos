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
from .serializers import EnergyEventCreateSerializer
from .services.apply_energy_event import apply_energy_event
from .services.dashboard import generate_dashboard
from .services.events_list import generate_events_list
from .services.statistics.activities_summary import generate_activities_summary
from .services.statistics.energy_overview import generate_energy_overview


@extend_schema(
    request=EnergyEventCreateSerializer,
    responses={200: {}},
    description="Create new load or recovery event",
    summary="Create energy event",
)
class EnergyEventCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = EnergyEventCreateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        apply_energy_event(user=request.user, **serializer.validated_data)

        return Response(status=HTTP_201_CREATED)


# @extend_schema(
#     request=EnergyDashboardSerializer,
#     responses={
#         200: {
#             "type": "object",
#             "properties": {
#                 "greeting": {"type": "string", "description": "Personal user greeting"},
#                 "current_energy": {
#                     "type": "number",
#                     "format": "float",
#                     "description": "User's current energy level (0.0-1.0)",
#                 },
#                 "message": {
#                     "type": "object",
#                     "properties": {
#                         "title": {"type": "string", "description": "Info message title"},
#                         "content": {"type": "string", "description": "Info message"},
#                     },
#                 },
#                 "recommendation": {
#                     "type": "string",
#                     "description": "Personalized recommendation for user",
#                 },
#                 "last_event": {
#                     "type": "object",
#                     "properties": {
#                         "id": {"type": "number", "description": "Last user energy event id"},
#                         "event_type": {
#                             "type": "string",
#                             "description": "Event type(load or recovery)",
#                         },
#                         "activity_type": {"type": "string", "description": "Activity type"},
#                         "started_at": {
#                             "type": "string",
#                             "format": "date-time",
#                             "description": "Event start time",
#                         },
#                         "ended_at": {
#                             "type": "string",
#                             "format": "date-time",
#                             "description": "Event end time",
#                         },
#                         "energy_delta": {
#                             "type": "number",
#                             "format": "float",
#                             "description": "Energy delta of the last energy event",
#                         },
#                         "subjective_coef": {
#                             "type": "number",
#                             "format": "float",
#                             "description": "Subjective assessment of the last event",
#                         },
#                     },
#                 },
#             },
#         }
#     },
#     description="Main screen dashboard with common data",
#     summary="User dashboard",
# )
# class EnergyDashboardView(APIView):
#     def get(self, request):
#         user = request.user
#         dashboard = generate_dashboard(user=user)
#         serializer = EnergyDashboardSerializer(instance=dashboard)
#         dashboard = serializer.data
#         return Response(dashboard, status=HTTP_200_OK)
#
#
# @extend_schema(
#     request=None,
#     responses={
#         200: {
#             "type": "object",
#             "properties": {
#                 "results": {
#                     "type": "array",
#                     "items": {
#                         "type": "object",
#                         "properties": {
#                             "event_id": {"type": "integer"},
#                             "event_type": {"type": "string"},
#                             "activity_type": {"type": "string"},
#                             "started_at": {"type": "string", "format": "date-time"},
#                             "ended_at": {"type": "string", "format": "date-time"},
#                             "energy_delta": {"type": "number"},
#                         },
#                     },
#                 }
#             },
#         }
#     },
#     description="Returns list of all energy events for the authenticated user",
#     summary="User energy events list",
# )
# class EventsListView(APIView):
#     def get(self, request):
#         user = request.user
#         events_list = generate_events_list(user=user)
#         serializer = EventsListSerializer(instance=events_list)
#         events_list = serializer.data
#         return Response(events_list, status=HTTP_200_OK)
#
#
# @extend_schema(
#     request=None,
#     responses={
#         200: {
#             "type": "object",
#             "properties": {
#                 "energy_overview": {
#                     "type": "object",
#                     "properties": {
#                         "period": {
#                             "type": "object",
#                             "properties": {
#                                 "type": {"type": "string"},
#                                 "from": {"type": "string", "format": "date"},
#                                 "to": {"type": "string", "format": "date"},
#                             },
#                         },
#                         "activities": {
#                             "type": "array",
#                             "items": {
#                                 "type": "object",
#                                 "properties": {
#                                     "date": {"type": "string", "format": "date"},
#                                     "energy": {"type": "number", "nullable": True},
#                                 },
#                             },
#                         },
#                     },
#                 },
#                 "activities_summary": {
#                     "type": "object",
#                     "properties": {
#                         "period": {
#                             "type": "object",
#                             "properties": {
#                                 "type": {"type": "string"},
#                                 "from": {"type": "string", "format": "date"},
#                                 "to": {"type": "string", "format": "date"},
#                             },
#                         },
#                         "scale": {
#                             "type": "object",
#                             "properties": {
#                                 "min": {"type": "number"},
#                                 "max": {"type": "number"},
#                             },
#                         },
#                         "activities": {
#                             "type": "array",
#                             "items": {
#                                 "type": "object",
#                                 "properties": {
#                                     "activity_type": {"type": "string"},
#                                     "avg_energy_delta": {"type": "number"},
#                                     "event_count": {"type": "integer"},
#                                 },
#                             },
#                         },
#                     },
#                 },
#             },
#         }
#     },
#     description="Returns weekly energy overview and summary of user's activities",
#     summary="User energy statistics",
# )
# class BaseStatisticsView(APIView):
#     def get(self, request):
#         user = request.user
#         energy_overview = generate_energy_overview(user=user)
#         activities_summary = generate_activities_summary(user=user)
#         statistics = {"energy_overview": energy_overview, "activities_summary": activities_summary}
#         serializer = BaseStatisticsSerializer(instance=statistics)
#         statistics = serializer.data
#         return Response(statistics, status=HTTP_200_OK)
