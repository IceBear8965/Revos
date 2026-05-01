import { ActivityTypeCategory } from "@/entities/activity-type/model/types"

export interface Event {
    id: number
    type: ActivityTypeCategory
    activityType: string
    startedAt: Date
    endedAt: Date
    energyDelta: number
    subjectiveCoef: number
}
