import { useState, useCallback } from "react"
import { changeTimezone } from "@/api/changeTimezone"
import { UseAsyncPost } from "@/shared/types"
import { ChangeTimezoneResponseType } from "../types"
import { ChangeTimezonePayloadDTO, ChangeTimezoneResponseDTO } from "@/api/types"

export const useTimezone = (): UseAsyncPost<ChangeTimezoneResponseType, string> => {
    const [data, setData] = useState<ChangeTimezoneResponseType | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const fetchChangeTimezone = useCallback(async (timezone: string) => {
        setIsLoading(true)
        setError(null)

        const changeTimezonePayload: ChangeTimezonePayloadDTO = {
            timezone: timezone,
        }
        try {
            const response: ChangeTimezoneResponseDTO | null =
                await changeTimezone(changeTimezonePayload)
            if (response) {
                const mappedData: ChangeTimezoneResponseType = {
                    newTimezone: response.updated_timezone,
                }
                setData(mappedData)
            }
        } catch (error) {
            setError(error instanceof Error ? error : new Error("Unknown error"))
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        data,
        isLoading,
        error,
        refetch: fetchChangeTimezone,
    }
}
