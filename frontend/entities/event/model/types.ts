import { ActivityTypeCategory } from "@/entities/activity-type/model/types"

export interface Event {
    id: number
    activity: {
        id: number
        name: string
        category: ActivityTypeCategory
    }
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

export interface EventCardProps {
    event: Event
    onEdit: (event: Event) => void
    onDelete: (id: number) => void
}
