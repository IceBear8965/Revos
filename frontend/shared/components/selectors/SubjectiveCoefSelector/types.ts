import { ActivityTypeCategory } from "@/entities/activity-type/model/types"

interface SubjectiveCoefSelectorProps {
    eventType: ActivityTypeCategory
    subjectiveCoef: number
    onChange: (value: number) => void
}

interface Choices {
    icon: "emoticon-sad-outline" | "emoticon-neutral-outline" | "emoticon-happy-outline"
    value: number
}

export { SubjectiveCoefSelectorProps, Choices }
