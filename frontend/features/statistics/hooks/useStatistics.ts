import { useState, useCallback } from "react"
import { statisticsService } from "@/entities/statistics/model/statistics.service"
import { Statistic } from "@/entities/statistics/model/types"
import { UseAsync } from "@/shared/types"

export const useStatistics = (): UseAsync<Statistic> => {
    const [data, setData] = useState<Statistic | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const fetchStatistics = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const statistics = await statisticsService.get()
            setData(statistics)
        } catch (error) {
            setError(error instanceof Error ? error : new Error("Uknown error"))
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        data: data,
        isLoading: isLoading,
        error: error,
        execute: fetchStatistics,
    }
}
