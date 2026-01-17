from django.urls import path

from .views import EnergyEventCreateView, EnergyEventEditView, EventsView

urlpatterns = [
    path("events/", EventsView.as_view(), name="energy-events"),
    path("create_event/", EnergyEventCreateView.as_view(), name="create-energy-event"),
    path("edit_last_event/", EnergyEventEditView.as_view(), name="edit-last-energy-event"),
]
