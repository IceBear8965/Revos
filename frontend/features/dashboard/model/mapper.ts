import { DashboardDTO } from "@/shared/api/dashboard/types"
import { DashboardType } from "../model/types"
import { mapEvent } from "@/entities/event/model/mappers"

export const mapDashboard = (dto: DashboardDTO): DashboardType => ({
    greeting: dto.greeting,
    currentEnergy: dto.current_energy,
    message: dto.message,
    recommendation: dto.recommendation,
    lastEvent: dto.last_event ? mapEvent(dto.last_event) : null,
})
