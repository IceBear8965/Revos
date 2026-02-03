import { apiClient } from "./axios"

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
        started_at: string // DateTime
        ended_at: string
        energy_delta: number
    }
}

export const getDashboardData = async (): Promise<DashboardType> => {
    const request = await apiClient.get("energy/dashboard/")
    return request.data
}
