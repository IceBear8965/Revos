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

interface DashboardType {
    greeting: string
    current_energy: number
    message: {
        title: string
        content: string
    }
    recommendation: string
    last_event: {
        id: number
        event_type: string
        activity_type: string
        started_at: string
        ended_at: string
        energy_delta: number
    }
}

interface CreateEventProps {
    activity_type: "work" | "study" | "sport" | "society"
    started_at: string
    ended_at: string
    subjective_coef: number
}

export {
    PendingRequest,
    RequestOptions,
    RefreshResponse,
    LoginResponse,
    DashboardType,
    CreateEventProps,
}
