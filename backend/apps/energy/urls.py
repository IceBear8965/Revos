from django.urls import path

from .views import (
    ActivityTypesView,
    ActivityTypeView,
    BaseStatisticsView,
    EnergyDashboardView,
    EnergyEventCreateView,
    EnergyEventDeleteView,
    EnergyEventEditView,
    EventsListView,
)

urlpatterns = [
    path("activity_types/", ActivityTypesView.as_view(), name="activity-types"),
    path("activity_type/<int:id>/", ActivityTypeView.as_view(), name="activity-type"),
    path("create_event/", EnergyEventCreateView.as_view(), name="create-energy-event"),
    path("edit_event/<int:id>/", EnergyEventEditView.as_view(), name="edit-energy-event"),
    path("delete_event/<int:id>/", EnergyEventDeleteView.as_view(), name="delete-energy-event"),
    path("dashboard/", EnergyDashboardView.as_view(), name="dashboard"),
    path("events_list/", EventsListView.as_view(), name="events_list"),
    path("statistics/", BaseStatisticsView.as_view(), name="statistics"),
]
