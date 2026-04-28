import { httpClient } from "./HttpClient"

export const deleteEvent = async (id: number): Promise<void> => {
    const response = await httpClient.delete<void>(`energy/delete_event/${id}/`)

    return response
}
