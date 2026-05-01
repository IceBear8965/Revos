interface EnergyOverviewElement {
    date: string
    energy: number
}
interface ActivitiesSummaryElement {
    activity: string
    avg_energy_delta: number
    event_count: number
}

interface PeriodDTO {
    type: string
    from: string // ISO8601
    to: string //ISO8601
}

export interface StatisticsDTO {
    energy_overview: {
        period: PeriodDTO
        activities: EnergyOverviewElement[]
    }
    activities_summary: {
        period: PeriodDTO
        scale: {
            min: number
            max: number
        }
        activities: ActivitiesSummaryElement[]
    }
}
