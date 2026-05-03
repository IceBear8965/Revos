export interface EnergyOverviewElement {
    date: Date
    energy: number
}
export interface ActivitiesSummaryElement {
    activity: string
    avgEnergyDelta: number
    eventCount: number
}

interface Period {
    type: string
    from: Date
    to: Date
}

export interface Statistic {
    energyOverview: {
        period: Period
        activities: EnergyOverviewElement[]
    }
    activitiesSummary: {
        period: Period
        scale: {
            min: number
            max: number
        }
        activities: ActivitiesSummaryElement[]
    }
}
