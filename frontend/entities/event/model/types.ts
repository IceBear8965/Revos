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

export interface EventsList {
    date: Date // ISO8601
    hasPrev: boolean
    hasNext: boolean
    results: Event[]
}

export interface CreateEventRequest {
    activity: number
    startedAt: Date
    endedAt: Date
    subjectiveCoef: number
}

export interface EditEventRequest {
    activity: number
    startedAt: Date
    endedAt: Date
    subjectiveCoef: number
}
