import { useState, useCallback } from "react"
import { UseAsync } from "@/shared/types"
import { ChangeNicknameRequest } from "@/entities/user/model/types"
import { userService } from "@/entities/user/model/user.service"

export const useChangeNickname = (): UseAsync<void, [ChangeNicknameRequest]> => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const changeNickname = useCallback(async (body: ChangeNicknameRequest): Promise<void> => {
        setIsLoading(true)
        setError(null)

        try {
            await userService.changeNickname(body)
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
        execute: changeNickname,
    }
}
