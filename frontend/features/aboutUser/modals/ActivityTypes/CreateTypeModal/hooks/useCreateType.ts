import { useState, useCallback } from "react"
import { createActivityType } from "@/api/createActivityType"
import { UseAsyncPost } from "@/shared/types"
import { CreateTypeProps } from "../types"
import { EditActivityTypePayload } from "@/api/types"

export const useCreateType = (): UseAsyncPost<void, CreateTypeProps> => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const createType = useCallback(async (body: CreateTypeProps): Promise<void> => {
        setIsLoading(true)
        setError(null)

        const requestBody: EditActivityTypePayload = {
            name: body.name.toLowerCase(),
            category: body.category,
            value: body.value,
        }

        try {
            await createActivityType(requestBody)
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
        refetch: createType,
    }
}
