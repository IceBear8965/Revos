MIN_ENERGY = 0.05
MAX_ENERGY = 1.0


# --- Типы событий ---
LOAD = "load"
RECOVERY = "recovery"

EVENT_TYPE_CHOICES = [
    (LOAD, "Load"),
    (RECOVERY, "Recovery"),
]

# --- Коды активностей ---
ACTIVITY_CODES = ["work", "study", "society", "sleep", "rest", "sport", "walking"]

LOAD_ACTIVITIES = [
    "work",
    "study",
    "society",
    "sport",
]

RECOVERY_ACTIVITIES = [
    "sleep",
    "rest",
    "walking",
]

# --- Для serializer ---
ACTIVITY_TYPE_CHOICES = [(code, code.capitalize()) for code in ACTIVITY_CODES]

# --- Категории активностей ---
# Определяем, к какой категории относится каждая активность
ACTIVITY_CATEGORIES = {
    "work": LOAD,
    "study": LOAD,
    "society": LOAD,
    "sport": LOAD,
    "sleep": RECOVERY,
    "rest": RECOVERY,
    "walking": RECOVERY,
}

ALLOWED_LOAD_ACTIVITIES = {"work", "study", "sport", "society"}

PERSONAL_COEF_MIN = 0.9
PERSONAL_COEF_MAX = 1.2
