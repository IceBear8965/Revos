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

export const LOAD_ACTIVITIES = ["work", "study", "sport", "society"]
export type LoadActivityKey = (typeof LOAD_ACTIVITIES)[number]
export const RECOVERY_ACTIVITIES = ["sleep", "rest", "walking"]
