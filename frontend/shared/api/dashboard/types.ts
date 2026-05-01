export interface DashboardDTO {
    greeting: string
    current_energy: number
    message: {
        title: string
        content: string
    }
    recommendation: string
    last_event: {
        id: number
        event_type: "load" | "recovery" | "system"
        activity_type: string
        started_at: string
        ended_at: string
        energy_delta: number
        subjective_coef: number
    }
}
