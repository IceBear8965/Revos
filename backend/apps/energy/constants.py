MIN_ENERGY = 0.05
MAX_ENERGY = 1.0

BASE_LOAD_COEF = 0.00005
BASE_RECOVERY_COEF = 0.00003

# --- Типы событий ---
LOAD = "load"
RECOVERY = "recovery"

EVENT_TYPE_CHOICES = [
    (LOAD, "Load"),
    (RECOVERY, "Recovery"),
]

# --- Коды активностей ---
ACTIVITY_CODES = ["work", "study", "society", "sleep", "rest", "sport", "walk"]

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
    "walk": RECOVERY,
}

ALLOWED_LOAD_ACTIVITIES = {"work", "study", "sport", "society"}

PERSONAL_COEF_MIN = 1.0
PERSONAL_COEF_MAX = 1.4
