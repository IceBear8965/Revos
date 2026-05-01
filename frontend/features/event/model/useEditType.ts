import { useState, useCallback } from "react"
import { UseAsync } from "@/shared/types"
import { EditEventRequest } from "@/entities/event/model/types"
import { eventService } from "@/entities/event/model/event.service"

export const useEditEvent = (): UseAsync<void, [number, EditEventRequest]> => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const editEvent = useCallback(async (id: number, body: EditEventRequest): Promise<void> => {
        setIsLoading(true)
        setError(null)

        try {
            await eventService.edit(id, body)
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
        execute: editEvent,
    }
}
