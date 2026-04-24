import { httpClient } from "./HttpClient"
import { ChangeTimezonePayloadDTO, ChangeTimezoneResponseDTO } from "./types"

export const changeTimezone = async (
    body: ChangeTimezonePayloadDTO
): Promise<ChangeTimezoneResponseDTO | null> => {
    const response: ChangeTimezoneResponseDTO = await httpClient.patch(
        "user/change_timezone/",
        body
    )
    if (response) {
        return response
    } else {
        return null
    }
}
