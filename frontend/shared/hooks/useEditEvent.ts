import { useState, useCallback } from "react"
import { EditEventProps, UseAsyncPost } from "@/shared/types"
import { EditActivityTypePayload, EditEventPayloadDTO } from "@/api/types"
import { editEventAPI } from "@/api/editEvent"

export const useEditEvent = (): UseAsyncPost<string, EditEventProps> => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const editEvent = useCallback(async (body: EditEventProps): Promise<void> => {
        setIsLoading(true)
        setError(null)

        const requestBody: EditEventPayloadDTO = {
            activity: body.activity,
            started_at: body.startedAt.toISOString(),
            ended_at: body.endedAt.toISOString(),
            subjective_coef: body.subjeciveCoef,
        }

        try {
            await editEventAPI(requestBody, body.id)
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
        refetch: editEvent,
    }
}
