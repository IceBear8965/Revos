import { useState, useCallback } from "react"
import { EditEventPayloadDTO } from "@/api/types"
import { UseAsyncPost } from "@/shared/types"
import { EditEventProps } from "../modals/EditEventModal/types"
import { editEvent } from "@/api/editEvent"

export const useEditEvent = (): UseAsyncPost<void, EditEventProps> => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const editEventPost = useCallback(async (body: EditEventProps) => {
        setIsLoading(true)
        setError(null)

        try {
            const requestPayload: EditEventPayloadDTO = {
                id: body.id,
                activity_type: body.activityType,
                started_at: body.startedAt.toISOString(),
                ended_at: body.endedAt.toISOString(),
                subjective_coef: body.subjectiveCoef,
            }
            await editEvent(requestPayload)
        } catch (error) {
            setError(error instanceof Error ? error : new Error("Unknown error"))
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        data: null,
        isLoading,
        error,
        refetch: editEventPost,
    }
}
