interface EventsListElement {
    id: number
    event_type: "load" | "recovery" | "system"
    activity_type: string
    started_at: string
    ended_at: string
    energy_delta: number
    subjective_coef: number
}

export interface EventsListDTO {
    date: string
    has_prev: boolean
    has_next: boolean
    results: EventsListElement[]
}
