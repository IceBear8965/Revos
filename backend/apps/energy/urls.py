from django.urls import path

from .views import EnergyDashboardView, EnergyEventCreateView, EnergyEventEditView, EventsListView

urlpatterns = [
    path("create_event/", EnergyEventCreateView.as_view(), name="create-energy-event"),
    path("edit_last_event/", EnergyEventEditView.as_view(), name="edit-last-energy-event"),
    path("dashboard/", EnergyDashboardView.as_view(), name="dashboard"),
    path("events_list/", EventsListView.as_view(), name="events_list"),
]
