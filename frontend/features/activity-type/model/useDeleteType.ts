import { useState, useCallback } from "react"
import { UseAsync } from "@/shared/types"
import { activityTypeService } from "@/entities/activity-type/model/activity-type.service"

export const useDeleteType = (): UseAsync<void, [number]> => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const deleteActivityType = useCallback(async (id: number): Promise<void> => {
        setIsLoading(true)
        setError(null)

        try {
            await activityTypeService.delete(id)
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
        execute: deleteActivityType,
    }
}
