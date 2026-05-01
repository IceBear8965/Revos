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

export interface UseAsync<TData, TArgs extends unknown[] = []> {
    data: TData | null
    isLoading: boolean
    error: Error | null
    execute: (...args: TArgs) => Promise<void>
}

type EventOptionsType = "load" | "recovery" | "system"

export { EventType, EventCardProps, EditEventProps, EventOptionsType }
