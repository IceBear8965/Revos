from enum import Enum


class EventType(str, Enum):
    LOAD = "load"
    RECOVERY = "recovery"
    SYSTEM = "system"
