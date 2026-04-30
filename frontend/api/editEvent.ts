import { EditEventPayloadDTO } from "./types"
import { httpClient } from "./HttpClient"

export const editEventAPI = async (body: EditEventPayloadDTO, id: number): Promise<string> => {
    const request = await httpClient.patch<string>(`energy/edit_event/${id}/`, body)

    return request
}
