import { statisticsApi } from "../api/statistics.api"
import { mapStatistic } from "./mappers"
import { Statistic } from "./types"

export const statisticsService = {
    get: async (): Promise<Statistic> => {
        const dto = await statisticsApi.get()
        return mapStatistic(dto)
    },
}
