import { httpClient } from "./HttpClient"
import { AboutUserResponseDTO } from "./types"

export const getAboutUser = async (): Promise<AboutUserResponseDTO | null> => {
    const response: AboutUserResponseDTO = await httpClient.get("user/me/")
    if (response) {
        return response
    } else {
        return null
    }
}
