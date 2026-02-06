import { getDashboardData } from "@/api/dashboard"
import { LastEventDTO } from "@/api/types"
import { DashboardType } from "../types"

export const useDashboard = async (): Promise<DashboardType | null> => {
    const data = await getDashboardData()
    if (data) {
        const lastEvent: LastEventDTO | null = data.last_event ?? null

        return {
            greeting: data.greeting,
            currentEnergy: data.current_energy,
            message: { title: data.message.title, content: data.message.content },
            recommendation: data.recommendation,
            lastEvent: lastEvent
                ? {
                      id: lastEvent.id,
                      eventType: lastEvent.event_type as "load" | "recovery",
                      activityType: lastEvent.activity_type,
                      startedAt: new Date(lastEvent.started_at),
                      endedAt: new Date(lastEvent.ended_at),
                      energyDelta: lastEvent.energy_delta,
                      subjectiveCoef: lastEvent.subjective_coef ?? 1.0,
                  }
                : null,
        }
    } else {
        return null
    }
}
