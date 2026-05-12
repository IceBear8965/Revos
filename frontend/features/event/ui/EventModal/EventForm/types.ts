import { ActivityTypeCategoryWritable } from "@/entities/activity-type/model/types"
import { Dispatch, SetStateAction } from "react"

export interface EventFormProps<T> {
    mode: "create" | "edit"
    eventType: ActivityTypeCategoryWritable
    activity: number | null
    startedAt: Date
    endedAt: Date
    subjectiveCoef: number

    setActivity: Dispatch<SetStateAction<T | null>>
    setStartedAt: (v: Date) => void
    setEndedAt: (v: Date) => void
    setSubjectiveCoef: (v: number) => void
}
