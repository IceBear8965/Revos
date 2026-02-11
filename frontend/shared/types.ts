import { ActivityTypeKey } from "./constants"

interface EventType {
    id: number
    eventType: string
    activityType: ActivityTypeKey
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
    refetch: () => Promise<void>
}

interface UseAsyncPost<T, P> {
    data: T | null
    isLoading: boolean
    error: Error | null
    refetch: (body: P) => Promise<void>
}

type EventOptionsType = "load" | "recovery"

export { EventType, EventCardProps, UseAsyncGet, UseAsyncPost, EventOptionsType }
