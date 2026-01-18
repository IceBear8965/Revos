from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
)
from rest_framework.views import APIView

from .domain.errors import EnergyDomainError
from .serializers import EnergyEventCreateSerializer, EnergyEventEditSerializer, EnergyEventSerializer
from .services.apply_energy_event import apply_energy_event
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
        event = apply_energy_event(user=request.user, **validated_data)
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
