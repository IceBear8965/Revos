import { useState, useCallback } from "react"
import { UseAsyncDelete } from "@/shared/types"
import { deleteEvent } from "@/api/deleteEvent"
import { DeleteEventPayload } from "../types"

export const useDeleteEvent = (): UseAsyncDelete<DeleteEventPayload> => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const deleteEnergyEvent = useCallback(async (body: DeleteEventPayload): Promise<void> => {
        setIsLoading(true)
        setError(null)

        try {
            await deleteEvent(body.id)
        } catch (error) {
            setError(error instanceof Error ? error : new Error("Unknown error"))
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        isLoading,
        error,
        refetch: deleteEnergyEvent,
    }
}
