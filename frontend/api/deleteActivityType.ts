import { httpClient } from "./HttpClient"

export const deleteActivityType = async (id: number): Promise<void> => {
    const response = await httpClient.delete<void>(`energy/activity_type/${id}/`)

    return response
}
