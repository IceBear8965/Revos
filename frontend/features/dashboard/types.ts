import { ActivityTypeKey } from "@/shared/constants"

interface LastEvent {
    id: number
    eventType: "load" | "recovery"
    activityType: ActivityTypeKey
    startedAt: Date
    endedAt: Date
    energyDelta: number
    subjectiveCoef: number
}

interface DashboardType {
    greeting: string
    currentEnergy: number
    message: { title: string; content: string }
    recommendation: string
    lastEvent: LastEvent | null
}

interface DeleteEventPayload {
    id: number
}

export { LastEvent, DashboardType, DeleteEventPayload }
