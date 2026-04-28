import { useState, useCallback } from "react"
import { editActivityType } from "@/api/editActivityType"
import { UseAsyncPost } from "@/shared/types"
import { EditActivityTypePayload } from "@/api/types"
import { EditTypeProps } from "../types"

export const useEditType = (): UseAsyncPost<void, EditTypeProps> => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const editType = useCallback(async (body: EditTypeProps): Promise<void> => {
        setIsLoading(true)
        setError(null)

        const requestBody: EditActivityTypePayload = {
            name: body.name.toLowerCase(),
            category: body.category,
            value: body.value,
        }

        try {
            await editActivityType(requestBody, body.id)
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
        refetch: editType,
    }
}
