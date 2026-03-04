from apps.energy.domain.errors import EnergyDomainError
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    if isinstance(exc, EnergyDomainError):
        return Response(
            exc.to_response(),
            status=exc.status_code,
        )

    return exception_handler(exc, context)
