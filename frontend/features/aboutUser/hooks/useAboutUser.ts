import { useCallback, useState } from "react"
import { UseAsync } from "@/shared/types"
import { userService } from "@/entities/user/model/user.service"
import { User } from "@/entities/user/model/types"

export const useAboutUser = (): UseAsync<User> => {
    const [data, setData] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const fetchAboutUser = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const user = await userService.getMe()
            setData(user)
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
        execute: fetchAboutUser,
    }
}
