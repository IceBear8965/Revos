import { httpClient } from "./HttpClient"
import { ActivityTypeDTO } from "./types"

export const getActivityTypes = async (): Promise<ActivityTypeDTO[] | null> => {
    const data: ActivityTypeDTO[] = await httpClient.get("energy/activity_types/")
    if (data) {
        return data
    } else {
        return null
    }
}
