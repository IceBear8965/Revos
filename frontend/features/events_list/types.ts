interface EventsListElementType {
    eventId: number
    eventType: "load" | "recovery"
    activityType: string
    startedAt: Date
    endedAt: Date
    energyDelta: number
}

interface EventsListType {
    results: EventsListElementType[]
}

export { EventsListElementType, EventsListType }
