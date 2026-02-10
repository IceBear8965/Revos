import { EditEventPayloadDTO, EditEventResponseDTO } from "./types"
import { httpClient } from "./HttpClient"

export const editEvent = async (body: EditEventPayloadDTO): Promise<EditEventResponseDTO> => {
    const response: EditEventResponseDTO = await httpClient.post("energy/edit_last_event/", body)
    if (!response) throw new Error("API returned null")

    return response
}
