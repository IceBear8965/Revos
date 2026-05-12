import { useState, useCallback } from "react"
import { UseAsync } from "@/shared/types"
import { ChangeNicknameRequest, ChangeTimezoneRequest } from "@/entities/user/model/types"
import { userService } from "@/entities/user/model/user.service"

export const useChangeTimezone = (): UseAsync<void, [ChangeTimezoneRequest]> => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const changeTimezone = useCallback(async (body: ChangeTimezoneRequest): Promise<void> => {
        setIsLoading(true)
        setError(null)

        try {
            await userService.changeTimezone(body)
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
        execute: changeTimezone,
    }
}
