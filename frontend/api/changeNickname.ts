import { httpClient } from "./HttpClient"
import { ChangeNicknamePayloadDTO, ChangeNicknameResponseDTO } from "./types"

export const changeNickname = async (
    body: ChangeNicknamePayloadDTO
): Promise<ChangeNicknameResponseDTO | null> => {
    const response: ChangeNicknameResponseDTO = await httpClient.patch(
        "user/change_nickname/",
        body
    )
    if (response) {
        return response
    } else {
        return null
    }
}
