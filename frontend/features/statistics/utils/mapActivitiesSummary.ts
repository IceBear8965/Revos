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
            positiveDelta: el.avgEnergyDelta > 0 ? el.avgEnergyDelta : null,
            negativeDelta: el.avgEnergyDelta < 0 ? el.avgEnergyDelta : null,
        }))
        .sort((a, b) => a.activityType.localeCompare(b.activityType))
}
