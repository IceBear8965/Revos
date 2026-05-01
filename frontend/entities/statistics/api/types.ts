export interface EnergyOverviewElementDTO {
    date: string
    energy: number
}
export interface ActivitiesSummaryElementDTO {
    activity: string
    avg_energy_delta: number
    event_count: number
}

interface PeriodDTO {
    type: string
    from: string // ISO8601
    to: string //ISO8601
}

export interface StatisticDTO {
    energy_overview: {
        period: PeriodDTO
        activities: EnergyOverviewElementDTO[]
    }
    activities_summary: {
        period: PeriodDTO
        scale: {
            min: number
            max: number
        }
        activities: ActivitiesSummaryElementDTO[]
    }
}
