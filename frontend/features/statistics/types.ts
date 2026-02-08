import { ActivityTypeKey } from "@/shared/constants"
interface EnergyOverviewElement {
    date: Date
    energy: number | null
}
interface ActivitiesSummaryElement {
    activityType: ActivityTypeKey
    avgEnergyDelta: number
    eventCount: number
}

interface StatisticsType {
    energyOverview: {
        period: {
            type: "week" | "month"
            from: Date
            to: Date
        }
        activities: EnergyOverviewElement[]
    }
    activitiesSummary: {
        period: {
            type: "week" | "month"
            from: Date
            to: Date
        }
        scale: {
            min: number
            max: number
        }
        activities: ActivitiesSummaryElement[]
    }
}

export { EnergyOverviewElement, ActivitiesSummaryElement, StatisticsType }
