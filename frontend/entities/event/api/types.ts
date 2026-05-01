import { ActivityTypeCategory } from "@/entities/activity-type/model/types"

export interface EventDTO {
    id: number
    event_type: "load" | "recovery" | "system"
    activity_type: string
    started_at: string
    ended_at: string
    energy_delta: number
    subjective_coef: number
}

export interface CreateEventRequestDTO {
    activity: number
    started_at: string // ISO8601
    ended_at: string // ISO8601
    subjective_coef: number
}

export interface EditEventRequestDTO {
    activity: number
    started_at: string // ISO8601
    ended_at: string // ISO8601
    subjective_coef: number
}

export interface EventsListDTO {
    date: string
    has_prev: boolean
    has_next: boolean
    results: EventDTO[]
}
