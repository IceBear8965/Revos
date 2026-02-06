interface EventType {
    id: number
    eventType: string
    activityType: string
    startedAt: Date
    endedAt: Date
    energyDelta: number
    subjectiveCoef: number
}

export { EventType }
