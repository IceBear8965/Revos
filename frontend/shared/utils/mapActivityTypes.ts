import { LoadActivityKey } from "../constants"

export const ACTIVITY_CONFIG: Record<LoadActivityKey, { icon: string; label: string }> = {
    work: { icon: "briefcase", label: "Work" },
    sleep: { icon: "bed", label: "Sleep" },
    study: { icon: "book", label: "Study" },
    rest: { icon: "coffee", label: "Rest" },
    society: { icon: "users", label: "Society" },
    walking: { icon: "person-walking", label: "Walking" },
    sport: { icon: "dumbbell", label: "Sport" },
}

export const mapToLoadOrder = (keys: LoadActivityKey[]) => {
    return keys.map((key, index) => ({
        id: index,
        key,
        icon: ACTIVITY_CONFIG[key].icon,
        label: ACTIVITY_CONFIG[key].label,
    }))
}
