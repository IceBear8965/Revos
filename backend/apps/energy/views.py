from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
)
from rest_framework.views import APIView

from .domain.errors import EventIsNotLast, LastEventNotFound
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
        validated_data = serializer.validated_data
        try:
            new_event = edit_energy_event(user=request.user, **validated_data)
        except LastEventNotFound:
            return Response(
                {
                    "error": "last_event_not_found",
                    "detail": "User has no events to edit",
                },
                status=HTTP_404_NOT_FOUND,
            )
        except EventIsNotLast:
            return Response(
                {
                    "error": "event_is_not_last",
                    "detail": "You can edit only the last event",
                },
                status=HTTP_403_FORBIDDEN,
            )
        except Exception:
            return Response(
                {
                    "error": "energy_edit_failed",
                    "detail": "Unable to edit energy event",
                },
                status=HTTP_400_BAD_REQUEST,
            )
        return Response(
            {
                "id": new_event.id,
                "energy_before": new_event.energy_before,
                "energy_after": new_event.energy_after,
                "energy_delta": new_event.energy_delta,
            },
            status=HTTP_201_CREATED,
        )
