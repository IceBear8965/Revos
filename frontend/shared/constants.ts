export const ACTIVITY_ORDER = [
    "work",
    "sleep",
    "study",
    "rest",
    "society",
    "walking",
    "sport",
] as const
export type ActivityTypeKey = (typeof ACTIVITY_ORDER)[number]

export const LOAD_ACTIVITIES = [
    { activity: "work", icon: "calendar-days" },
    { activity: "study", icon: "book" },
    { activity: "sport", icon: "dumbbell" },
    { activity: "society", icon: "people-group" },
]
export const RECOVERY_ACTIVITIES = ["sleep", "rest", "walking"]
