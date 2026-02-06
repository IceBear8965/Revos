interface PendingRequest<T> {
    execute: () => Promise<T>
    resolve: (value: T) => void
    reject: (error: any) => void
}

interface RequestOptions {
    method?: "GET" | "POST" | "PATCH"
    body?: any
    headers?: Record<string, string>
}

interface LoginResponse {
    access: string
    refresh: string
}

interface RefreshResponse {
    access: string
}

interface LastEventDTO {
    id: number
    event_type: "load" | "recovery"
    activity_type: string
    started_at: string // ISO8601
    ended_at: string // ISO8601
    energy_delta: number
    subjective_coef: number
}

interface DashboardDTO {
    greeting: string
    current_energy: number
    message: {
        title: string
        content: string
    }
    recommendation: string
    last_event: LastEventDTO | null
}

interface CreateEventPayload {
    activity_type: string
    started_at: string
    ended_at: string
    subjective_coef: number
}

interface EventDTO {
    id: number
    event_type: "load" | "recovery"
    activity_type: string
    started_at: string
    ended_at: string
    energy_before: number
    energy_delta: number
    energy_after: number
    subjective_coef: number
}

interface EventsListElementDTO {
    id: number
    event_type: "load" | "recovery"
    activity_type: string
    started_at: string
    ended_at: string
    energy_delta: number
    subjective_coef: number
}

interface EventsListDTO {
    results: EventsListElementDTO[]
}

export {
    PendingRequest,
    RequestOptions,
    RefreshResponse,
    LoginResponse,
    LastEventDTO,
    DashboardDTO,
    CreateEventPayload,
    EventDTO,
    EventsListElementDTO,
    EventsListDTO,
}
