import { httpClient } from "./HttpClient"
import { CreateEventProps } from "./types.api"

export const createEvent = async ({
    activity_type,
    started_at,
    ended_at,
    subjective_coef,
}: CreateEventProps) => {
    const response = await httpClient.post("energy/create_event/", {
        activity_type: activity_type,
        started_at: started_at,
        ended_at: ended_at,
        subjective_coef: subjective_coef,
    })
    if (response) {
        return response
    } else {
        return null
    }
}
