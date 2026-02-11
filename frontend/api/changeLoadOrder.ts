import { httpClient } from "./HttpClient"
import { ChangeLoadOrderPayloadDTO, ChangeLoadOrderResponseDTO } from "./types"

export const changeLoadOrder = async (
    body: ChangeLoadOrderPayloadDTO
): Promise<ChangeLoadOrderPayloadDTO | null> => {
    const response: ChangeLoadOrderResponseDTO = await httpClient.patch(
        "energy/change_loads_order/",
        body
    )
    if (response) {
        return response
    } else {
        return null
    }
}
