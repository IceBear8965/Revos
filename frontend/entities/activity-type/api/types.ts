import { ActivityTypeCategory, ActivityTypeWriteModel } from "../model/types"

export interface ActivityTypeDTO {
    id: number
    name: string
    category: ActivityTypeCategory
    value: number
    is_editable: boolean
}

export type CreateActivityTypeRequest = ActivityTypeWriteModel
export type EditActivityTypeRequest = ActivityTypeWriteModel
