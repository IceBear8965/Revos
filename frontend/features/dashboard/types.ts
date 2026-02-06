interface LastEvent {
    id: number
    eventType: "load" | "recovery"
    activityType: string
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

interface CreateEventProps {
    activityType: string
    startedAt: Date
    endedAt: Date
    subjectiveCoef: number
}

interface CreateEventResponse {
    id: number
    eventType: "load" | "recovery"
    activityType: string
    startedAt: Date
    endedAt: Date
    energyBefore: number
    energyDelta: number
    energyAfter: number
    subjectiveCoef: number
}

export { LastEvent, DashboardType, CreateEventProps, CreateEventResponse }
