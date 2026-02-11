import { httpClient } from "./HttpClient"
import { StatisticsDTO } from "./types"

export const getStatisticsData = async (): Promise<StatisticsDTO | null> => {
    const response = await httpClient.get<StatisticsDTO>("energy/statistics/")
    if (response) {
        return response
    } else {
        return null
    }
}
