class EnergyDomainError(Exception):
    """Базовая ошибка домена энергии"""

    pass


class LastEventNotFound(Exception):
    pass


class EventIsNotLast(EnergyDomainError):
    pass
