from django.urls import path

from .views import (
    BaseStatisticsView,
    EnergyDashboardView,
    EnergyEventCreateView,
    EnergyEventEditView,
    EventsListView,
    PersonalActivityOrderView,
)

urlpatterns = [
    path("create_event/", EnergyEventCreateView.as_view(), name="create-energy-event"),
    path("edit_last_event/", EnergyEventEditView.as_view(), name="edit-last-energy-event"),
    path("dashboard/", EnergyDashboardView.as_view(), name="dashboard"),
    path("events_list/", EventsListView.as_view(), name="events_list"),
    path("statistics/", BaseStatisticsView.as_view(), name="statistics"),
    path("change_loads_order/", PersonalActivityOrderView.as_view(), name="loads-order"),
]
