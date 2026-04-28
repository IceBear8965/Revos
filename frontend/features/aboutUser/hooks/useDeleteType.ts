import { useState, useCallback } from "react"
import { UseAsyncDelete } from "@/shared/types"
import { deleteActivityType } from "@/api/deleteActivityType"
import { DeleteTypePayload } from "../types"

export const useDeleteType = (): UseAsyncDelete<DeleteTypePayload> => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const deleteType = useCallback(async (body: DeleteTypePayload): Promise<void> => {
        setIsLoading(true)
        setError(null)

        try {
            await deleteActivityType(body.id)
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
        refetch: deleteType,
    }
}
