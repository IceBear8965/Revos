import { useState, useCallback } from "react"
import { RegisterPayloadType } from "../types"
import { RegisterPayloadDTO } from "@/api/types"
import { UseAsyncPost } from "@/shared/types"
import { httpClient } from "@/api/HttpClient"

export const useRegistration = (): UseAsyncPost<null, RegisterPayloadType> => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)

    const fetctRegister = useCallback(async (body: RegisterPayloadType): Promise<void> => {
        setIsLoading(true)
        setError(null)

        const requestBody: RegisterPayloadDTO = {
            email: body.email,
            nickname: body.nickname,
            password: body.password,
            timezone: body.timezone,
            load_order: body.loadOrder.map((el) => el.label),
            initial_energy_state: body.initialEnergyState.state,
        }

        try {
            await httpClient.register(requestBody)
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
        refetch: fetctRegister,
    }
}
