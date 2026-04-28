import { useState, useCallback } from "react"
import { changeNickname } from "@/api/changeNickname"
import { UseAsyncPost } from "@/shared/types"
import { ChangeNicknameResponseType } from "../types"
import { ChangeNicknamePayloadDTO, ChangeNicknameResponseDTO } from "@/api/types"

export const useNickname = (): UseAsyncPost<ChangeNicknameResponseType, string> => {
    const [data, setData] = useState<ChangeNicknameResponseType | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const fetchChangeNickname = useCallback(async (nickname: string) => {
        setIsLoading(true)
        setError(null)

        const changeNicknamePayload: ChangeNicknamePayloadDTO = {
            nickname: nickname,
        }
        try {
            const response: ChangeNicknameResponseDTO | null =
                await changeNickname(changeNicknamePayload)
            if (response) {
                const mappedData: ChangeNicknameResponseType = {
                    newNickname: response.updated_nickname,
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
        refetch: fetchChangeNickname,
    }
}
