import { ActivityTypeDTO } from "@/api/types"

interface EventType {
    id: number
    eventType: EventOptionsType
    activityType: ActivityTypeDTO
    startedAt: Date
    endedAt: Date
    energyDelta: number
    subjectiveCoef: number
}

interface EventCardProps {
    event: EventType
    onEdit: (event: EventType) => void
    onDelete: (id: number) => void
}

interface EditEventProps {
    id: number // Passed to url as param
    activity: number
    startedAt: Date
    endedAt: Date
    subjeciveCoef: number
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

interface UseAsyncDelete<T> {
    isLoading: boolean
    error: Error | null
    refetch: (body: T) => Promise<void>
}

type EventOptionsType = "load" | "recovery" | "system"

export {
    EventType,
    EventCardProps,
    EditEventProps,
    UseAsyncGet,
    UseAsyncPost,
    UseAsyncDelete,
    EventOptionsType,
}
