import { httpClient } from "../HttpClient"
import { StatisticsDTO } from "./types"

export const statisticsApi = {
    get: async (): Promise<StatisticsDTO> => {
        const data = await httpClient.get<StatisticsDTO>("energy/statistics/")
        return data
    },
}
