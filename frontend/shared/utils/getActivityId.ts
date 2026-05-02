import { ActivityType } from "@/entities/activity-type/model/types"

export const getActivityIdByName = (types: ActivityType[], name: string) =>
    types.find((t) => t.name === name)?.id ?? null
