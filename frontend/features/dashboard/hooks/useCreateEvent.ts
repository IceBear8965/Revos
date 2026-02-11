import { useState, useCallback } from "react"
import { CreateEventProps } from "../modals/CreateEventModal/types"
import { createEvent } from "@/api/createEvent"
import { UseAsyncPost } from "@/shared/types"
import { CreateEventPayload } from "@/api/types"

export const useCreateEvent = (): UseAsyncPost<void, CreateEventProps> => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const createEnergyEvent = useCallback(async (body: CreateEventProps): Promise<void> => {
        setIsLoading(true)
        setError(null)

        const requestBody: CreateEventPayload = {
            activity_type: body.activityType,
            started_at: body.startedAt.toISOString(),
            ended_at: body.endedAt.toISOString(),
            subjective_coef: body.subjectiveCoef,
        }

        try {
            await createEvent(requestBody)
        } catch (error) {
            setError(error instanceof Error ? error : new Error("Unknown error"))
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        data: null,
        isLoading,
        error,
        refetch: createEnergyEvent,
    }
}
