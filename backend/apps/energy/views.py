from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
)
from rest_framework.views import APIView

from .domain.errors import ActivityTypeNotFound, EnergyDomainError, EventIsNotLast, LastEventNotFound
from .serializers import (
    EnergyDashboardSerializer,
    EnergyEventCreateSerializer,
    EnergyEventEditSerializer,
    EnergyEventSerializer,
    serializers,
)
from .services.apply_energy_event import apply_energy_event
from .services.dashboard import generate_dashboard
from .services.edit_energy_event import edit_energy_event


class EventsView(APIView):
    def post(self, request):
        serializer = EnergyEventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({"status": "validated"})


class EnergyEventCreateView(APIView):
    def post(self, request):
        serializer = EnergyEventCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        try:
            event = apply_energy_event(user=request.user, **validated_data)
        except ActivityTypeNotFound as e:
            return Response(
                e.to_response(),
                status=e.status_code,
            )
        return Response(
            {
                "id": event.id,
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

        try:
            event = edit_energy_event(
                user=request.user,
                **serializer.validated_data,
            )

        except EnergyDomainError as e:
            return Response(
                e.to_response(),
                status=e.status_code,
            )

        return Response(
            {
                "id": event.id,
                "energy_before": event.energy_before,
                "energy_delta": event.energy_delta,
                "energy_after": event.energy_after,
            }
        )


class EnergyDashboardView(APIView):
    def get(self, request):
        user = request.user
        dashboard = generate_dashboard(user=user)
        serializer = EnergyDashboardSerializer(instance=dashboard)
        dashboard = serializer.data
        return Response(dashboard, status=HTTP_200_OK)
