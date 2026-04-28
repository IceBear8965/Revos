import { httpClient } from "./HttpClient"
import { EditActivityTypePayload } from "./types"

export const editActivityType = async (
    body: EditActivityTypePayload,
    id: number
): Promise<void> => {
    const response = await httpClient.patch<void>(`energy/activity_type/${id}/`, body)

    return response
}
