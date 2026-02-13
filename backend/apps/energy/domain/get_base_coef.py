from ..models import BaseCoef


def get_base_coef(event_type: str) -> float:
    return BaseCoef.objects.get(coef_type=event_type).value
