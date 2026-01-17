from django.urls import path

from .views import EnergyEventCreateView, EventsView

urlpatterns = [
    path("events/", EventsView.as_view(), name="energy-events"),
    path("create_event/", EnergyEventCreateView.as_view(), name="create-energy-event"),
]
