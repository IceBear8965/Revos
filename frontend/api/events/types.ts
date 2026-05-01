export interface CreateEventRequest {
    activity: number
    started_at: string // ISO8601
    ended_at: string // ISO8601
    subjective_coef: number
}

export interface EditEventRequest {
    activity: number
    started_at: string // ISO8601
    ended_at: string // ISO8601
    subjective_coef: number
}
