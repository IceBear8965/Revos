import { httpClient } from "./HttpClient"
import { CreateActivityTypePayload, CreateActivityTypeResponse } from "./types"

export const createActivityType = async (
    body: CreateActivityTypePayload
): Promise<CreateActivityTypeResponse> => {
    const response = await httpClient.post<CreateActivityTypeResponse>(
        `energy/activity_types/`,
        body
    )

    return response
}
