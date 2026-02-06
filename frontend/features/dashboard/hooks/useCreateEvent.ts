import { useState, useCallback } from "react"
import { CreateEventProps } from "../types"
import { createEvent } from "@/api/createEvent"
import { UseAsyncPost } from "@/shared/types"

export const useCreateEvent = (): UseAsyncPost<void, CreateEventProps> => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const createEnergyEvent = useCallback(async (body: CreateEventProps): Promise<void> => {
        setIsLoading(true)
        setError(null)

        const requestBody = {
            activity_type: body.activityType,
            started_at: body.startedAt.toISOString(),
            ended_at: body.endedAt.toISOString(),
            subjective_coef: body.subjectiveCoef,
        }

        try {
            await createEvent(requestBody)
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"))
            throw err
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
