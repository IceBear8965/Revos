import { ACTIVITY_ORDER, ActivityTypeKey } from "@/shared/constants"

interface ActivitiesSummaryElement {
    activityType: ActivityTypeKey
    avgEnergyDelta: number
    eventCount: number
}

interface MappedActivityBar {
    activityType: ActivityTypeKey
    positiveDelta: number | null
    negativeDelta: number | null
    [key: string]: unknown
}

export const mapActivitiesSummary = (
    activities?: ActivitiesSummaryElement[]
): MappedActivityBar[] => {
    const byType = new Map<ActivityTypeKey, ActivitiesSummaryElement>()

    ;(activities ?? []).forEach((el) => {
        byType.set(el.activityType, el)
    })

    return ACTIVITY_ORDER.map((type) => {
        const item = byType.get(type)

        if (!item) {
            return {
                activityType: type,
                positiveDelta: null,
                negativeDelta: null,
            }
        }

        return {
            activityType: type,
            positiveDelta: item.avgEnergyDelta > 0 ? item.avgEnergyDelta : null,
            negativeDelta: item.avgEnergyDelta < 0 ? item.avgEnergyDelta : null,
        }
    })
}
