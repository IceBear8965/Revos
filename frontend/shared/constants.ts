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
