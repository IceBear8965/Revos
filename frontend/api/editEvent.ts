import { EditEventPayloadDTO } from "./types"
import { httpClient } from "./HttpClient"

export const editEvent = async (body: EditEventPayloadDTO) => {
    const response = await httpClient.post("energy/edit_last_event/", body)
    if (!response) throw new Error("API returned null")

    return response
}
