from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED
from rest_framework.views import APIView

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
        new_event = edit_energy_event(user=request.user, **validated_data)
        if not isinstance(new_event, int):
            return Response(
                {
                    "id": new_event.id,
                    "energy_before": new_event.energy_before,
                    "energy_after": new_event.energy_after,
                    "energy_delta": new_event.energy_delta,
                },
                status=HTTP_201_CREATED,
            )
        else:
            return Response({"status": "404"})
