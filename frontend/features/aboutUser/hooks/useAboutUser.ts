import { useCallback, useEffect, useState } from "react"
import { UseAsyncGet } from "@/shared/types"
import { AboutUserResponseType } from "../types"
import { getAboutUser } from "@/api/aboutUser"
import { AboutUserResponseDTO } from "@/api/types"

export const useAboutUser = (): UseAsyncGet<AboutUserResponseType> => {
    const [data, setData] = useState<AboutUserResponseType | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const fetchAboutUser = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const data: AboutUserResponseDTO | null = await getAboutUser()
            if (!data) {
                setData(null)
                return
            }

            const mappedData: AboutUserResponseType = {
                userId: data.user_id,
                email: data.email,
                nickname: data.nickname,
                timezone: data.timezone,
                loadOrder: data.load_order,
            }

            setData(mappedData)
        } catch (error) {
            setError(error instanceof Error ? error : new Error("Unknown error"))
        } finally {
            setIsLoading(false)
        }
    }, [])

    // useEffect(() => {
    //     fetchAboutUser()
    // }, [fetchAboutUser])

    return {
        data,
        isLoading,
        error,
        refetch: fetchAboutUser,
    }
}
