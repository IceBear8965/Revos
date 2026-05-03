import { ActivitiesSummaryElementDTO, EnergyOverviewElementDTO, StatisticDTO } from "../api/types"
import { Statistic } from "./types"
import { toDate } from "@/shared/utils/toDate"

export const mapStatistic = (dto: StatisticDTO): Statistic => ({
    energyOverview: {
        period: {
            type: dto.energy_overview.period.type,
            from: toDate(dto.energy_overview.period.from),
            to: toDate(dto.energy_overview.period.to),
        },
        activities: dto.energy_overview.activities.map((el: EnergyOverviewElementDTO) => ({
            date: toDate(el.date),
            energy: el.energy,
        })),
    },
    activitiesSummary: {
        period: {
            type: dto.activities_summary.period.type,
            from: toDate(dto.activities_summary.period.from),
            to: toDate(dto.activities_summary.period.to),
        },
        scale: {
            min: dto.activities_summary.scale.min,
            max: dto.activities_summary.scale.max,
        },
        activities: dto.activities_summary.activities.map((el: ActivitiesSummaryElementDTO) => ({
            activity: el.activity,
            avgEnergyDelta: el.avg_energy_delta,
            eventCount: el.event_count,
        })),
    },
})
