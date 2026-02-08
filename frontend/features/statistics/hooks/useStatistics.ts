import { useState, useEffect, useCallback } from "react"
import { getStatisticsData } from "@/api/statistics"
import { StatisticsType } from "../types"
import { UseAsyncGet } from "@/shared/types"
import { StatisticsDTO } from "@/api/types"

export const useStatistics = (): UseAsyncGet<StatisticsType> => {
    const [data, setData] = useState<StatisticsType | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchStatistics = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response: StatisticsDTO | null = await getStatisticsData()
            if (!response) {
                setData(null)
                return
            }

            const mappedData: StatisticsType = {
                energyOverview: {
                    period: {
                        type: response.energy_overview.period.type,
                        from: new Date(response.energy_overview.period.from),
                        to: new Date(response.energy_overview.period.to),
                    },
                    activities: response.energy_overview.activities.map((element) => {
                        return {
                            date: new Date(element.date),
                            energy: element.energy,
                        }
                    }),
                },
                activitiesSummary: {
                    period: {
                        type: response.activities_summary.period.type,
                        from: new Date(response.activities_summary.period.from),
                        to: new Date(response.activities_summary.period.to),
                    },
                    scale: {
                        min: response.activities_summary.scale.min,
                        max: response.activities_summary.scale.max,
                    },
                    activities: response.activities_summary.activities.map((element) => {
                        return {
                            activityType: element.activity_type,
                            avgEnergyDelta: element.avg_energy_delta,
                            eventCount: element.event_count,
                        }
                    }),
                },
            }

            setData(mappedData)
        } catch (error) {
            setError(error instanceof Error ? error : new Error("Uknown error"))
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStatistics()
    }, [fetchStatistics])

    return {
        data: data,
        isLoading: isLoading,
        error: error,
        refetch: fetchStatistics,
    }
}
