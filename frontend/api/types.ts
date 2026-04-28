import { ActivityTypeKey } from "@/shared/constants"

interface PendingRequest<T> {
    execute: () => Promise<T>
    resolve: (value: T) => void
    reject: (error: any) => void
}

interface RequestOptions {
    method?: "GET" | "POST" | "PATCH" | "DELETE"
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
    event_type: "load" | "recovery" | "system"
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
    activity: number
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

interface EnergyOverviewElementDTO {
    date: string // ISO8601
    energy: number | null
}
interface ActivitiesSummaryElementDTO {
    activity_type: ActivityTypeKey
    avg_energy_delta: number
    event_count: number
}
interface StatisticsDTO {
    energy_overview: {
        period: {
            type: "week" | "month"
            from: string // Date
            to: string // Date
        }
        activities: EnergyOverviewElementDTO[]
    }
    activities_summary: {
        period: {
            type: "week" | "month"
            from: string // Date
            to: string // Date
        }
        scale: {
            min: number
            max: number
        }
        activities: ActivitiesSummaryElementDTO[]
    }
}

interface RegisterPayloadDTO {
    email: string
    nickname: string
    password: string
    timezone: string
    load_order: string[]
    initial_energy_state: "very_tired" | "normal" | "full"
}

interface RegisterResponse {
    access: string
    refresh: string
}

interface EditEventPayloadDTO {
    id: number
    activity_type: string
    started_at: string // ISO8601
    ended_at: string // ISO8601
    subjective_coef: number
}

interface EditEventResponseDTO {
    id: number
    activity_type: string
    event_type: "load" | "recovery"
    started_at: string
    ended_at: string
    energy_before: number
    energy_delta: number
    energy_after: number
}

interface AboutUserResponseDTO {
    user_id: number
    email: string
    nickname: string
    timezone: string
    load_order: string[]
}

interface ChangeNicknamePayloadDTO {
    nickname: string
}
interface ChangeNicknameResponseDTO {
    updated_nickname: string
}

interface ChangeTimezonePayloadDTO {
    timezone: string
}
interface ChangeTimezoneResponseDTO {
    updated_timezone: string
}

interface ActivityTypeDTO {
    id: number
    name: string
    category: "load" | "recovery"
    value: number
    is_editable: boolean
}

interface EditActivityTypePayload {
    name: string
    category: "load" | "recovery"
    value: number
}

interface CreateActivityTypePayload {
    name: string
    category: "load" | "recovery"
    value: number
}

interface CreateActivityTypeResponse {
    status: string
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
    StatisticsDTO,
    RegisterPayloadDTO,
    RegisterResponse,
    EditEventPayloadDTO,
    EditEventResponseDTO,
    AboutUserResponseDTO,
    ChangeNicknamePayloadDTO,
    ChangeNicknameResponseDTO,
    ChangeTimezonePayloadDTO,
    ChangeTimezoneResponseDTO,
    ActivityTypeDTO,
    EditActivityTypePayload,
    CreateActivityTypePayload,
    CreateActivityTypeResponse,
}
