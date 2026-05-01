import { mapEvent } from "@/entities/event/model/mappers"
import { DashboardDTO } from "../api/types"
import { Dashboard } from "./types"

export const mapDashboard = (dto: DashboardDTO): Dashboard => ({
    greeting: dto.greeting,
    currentEnergy: dto.current_energy,
    message: dto.message,
    recommendation: dto.recommendation,
    lastEvent: dto.last_event ? mapEvent(dto.last_event) : null,
})
