from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
)


class EnergyDomainError(Exception):
    status_code = HTTP_400_BAD_REQUEST
    error_code = "energy_error"
    message = "Energy domain error"

    def to_response(self):
        return {
            "error": self.error_code,
            "detail": self.message,
        }


class ActivityTypeNotFound(EnergyDomainError):
    status_code = HTTP_404_NOT_FOUND
    error_code = "activity_type_not_found"
    message = "This Activity Type doesn't exist"


class LastEventNotFound(EnergyDomainError):
    status_code = HTTP_404_NOT_FOUND
    error_code = "last_event_not_found"
    message = "User has no energy events"


class EventIsNotLast(EnergyDomainError):
    status_code = HTTP_403_FORBIDDEN
    error_code = "event_is_not_last"
    message = "You can edit only the last energy event"
