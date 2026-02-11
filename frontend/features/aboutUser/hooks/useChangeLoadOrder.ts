import { useState, useCallback } from "react"
import { UseAsyncPost } from "@/shared/types"
import { ChangeLoadOrderPayloadType } from "../types"
import { changeLoadOrder } from "@/api/changeLoadOrder"

export const useChangeLoadOrder = (): UseAsyncPost<string[], ChangeLoadOrderPayloadType> => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const fetchChangeOrder = useCallback(async (body: ChangeLoadOrderPayloadType) => {
        setIsLoading(true)
        setError(null)

        try {
            await changeLoadOrder({ load_order: body.loadOrder.map((el) => el.key) })
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
        refetch: fetchChangeOrder,
    }
}
