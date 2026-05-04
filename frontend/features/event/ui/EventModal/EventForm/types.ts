import { ActivityTypeCategoryWritable } from "@/entities/activity-type/model/types"

export interface EventFormProps {
    mode: "create" | "edit"
    eventType: ActivityTypeCategoryWritable
    activity: number | null
    startedAt: Date
    endedAt: Date
    subjectiveCoef: number

    setActivity: (v: number) => void
    setStartedAt: (v: Date) => void
    setEndedAt: (v: Date) => void
    setSubjectiveCoef: (v: number) => void
}
