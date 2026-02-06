interface EventType {
    id: number
    eventType: string
    activityType: string
    startedAt: Date
    endedAt: Date
    energyDelta: number
    subjectiveCoef: number
}

interface EventCardProps {
    event: EventType
}

interface UseAsyncGet<T> {
    data: T | null
    isLoading: boolean
    error: Error | null
    refetch: () => void
}

interface UseAsyncPost<T, P> {
    data: T | null
    isLoading: boolean
    error: Error | null
    refetch: (body: P) => Promise<void>
}

export { EventType, EventCardProps, UseAsyncGet, UseAsyncPost }
