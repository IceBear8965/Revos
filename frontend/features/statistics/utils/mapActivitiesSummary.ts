import { ActivitiesSummaryElement } from "@/entities/statistics/model/types"

type ChartSafeActivity = {
    activityType: string
    positiveDelta: number | null
    negativeDelta: number | null
} & Record<string, unknown>

export const mapActivitiesSummary = (
    activities?: ActivitiesSummaryElement[]
): ChartSafeActivity[] => {
    if (!activities) return []

    return activities
        .map((el) => ({
            activityType: el.activity,
            positiveDelta: el.avgEnergyDelta > 0 ? el.avgEnergyDelta : 0,
            negativeDelta: el.avgEnergyDelta < 0 ? el.avgEnergyDelta : 0,
        }))
        .sort((a, b) => a.activityType.localeCompare(b.activityType))
}
