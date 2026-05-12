import { useState, useCallback } from "react"
import { UseAsync } from "@/shared/types"
import { CreateEventRequest } from "@/entities/event/model/types"
import { eventService } from "@/entities/event/model/event.service"

export const useCreateEvent = (): UseAsync<void, [CreateEventRequest]> => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const createEnergyEvent = useCallback(async (body: CreateEventRequest): Promise<void> => {
        setIsLoading(true)
        setError(null)

        try {
            await eventService.create(body)
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
        execute: createEnergyEvent,
    }
}
