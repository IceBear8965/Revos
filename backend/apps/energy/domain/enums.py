from enum import Enum


class ActivityCategory(str, Enum):
    LOAD = "load"
    RECOVERY = "recovery"
    SYSTEM = "system"
