from ..constants import ALLOWED_LOAD_ACTIVITIES, PERSONAL_COEF_MAX, PERSONAL_COEF_MIN


def get_personal_activity_coef(*, personal_profile, activity_type: str) -> float:
    """
    Возвращает персональный коэффициент активности для пользователя.

    - Работает только для load-активностей
    - Основан на относительном порядке load_order
    - Гарантированно возвращает float >= 1.0
    """

    try:
        load_order = personal_profile.load_order

        # базовые проверки
        if not isinstance(load_order, list):
            return 1.0

        if set(load_order) != ALLOWED_LOAD_ACTIVITIES:
            return 1.0

        if activity_type not in load_order:
            return 1.0

        total = len(load_order)

        # защита от деления на ноль
        if total < 2:
            return 1.0

        position = load_order.index(activity_type)

        # нормализация позиции в диапазон [0..1]
        normalized_position = position / (total - 1)

        # линейное масштабирование
        coef_range = PERSONAL_COEF_MAX - PERSONAL_COEF_MIN
        personal_coef = PERSONAL_COEF_MIN + normalized_position * coef_range * 0.6

        return round(personal_coef, 4)

    except Exception:
        # никакие проблемы профиля не должны ломать создание события
        return 1.0
