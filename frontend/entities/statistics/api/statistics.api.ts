import { httpClient } from "@/shared/api/HttpClient"
import { StatisticDTO } from "./types"

export const statisticsApi = {
    get: async (): Promise<StatisticDTO> => {
        const data = await httpClient.get<StatisticDTO>("energy/statistics/")
        return data
    },
}
