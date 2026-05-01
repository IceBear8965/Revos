import { useState, useCallback } from "react"
import { UseAsync } from "@/shared/types"
import { eventService } from "@/entities/event/model/event.service"

export const useDeleteEvent = (): UseAsync<void, [number]> => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const deleteEnergyEvent = useCallback(async (id: number): Promise<void> => {
        setIsLoading(true)
        setError(null)

        try {
            await eventService.delete(id)
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
        execute: deleteEnergyEvent,
    }
}
