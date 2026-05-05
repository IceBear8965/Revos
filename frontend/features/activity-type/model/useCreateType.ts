import { useState, useCallback } from "react"
import { UseAsync } from "@/shared/types"
import { activityTypeService } from "@/entities/activity-type/model/activity-type.service"
import { CreateActivityTypeRequest } from "@/entities/activity-type/api/types"

export const useCreateType = (): UseAsync<void, [CreateActivityTypeRequest]> => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const createActivityType = useCallback(
        async (body: CreateActivityTypeRequest): Promise<void> => {
            setIsLoading(true)
            setError(null)

            try {
                await activityTypeService.create(body)
            } catch (error) {
                setError(error instanceof Error ? error : new Error("Unknown error"))
                throw error
            } finally {
                setIsLoading(false)
            }
        },
        []
    )

    return {
        data: null,
        isLoading,
        error,
        execute: createActivityType,
    }
}
