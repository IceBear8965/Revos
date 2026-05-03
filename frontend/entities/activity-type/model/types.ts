export type ActivityTypeCategory = "load" | "recovery" | "system"

export type ActivityTypeCategoryWritable = Exclude<ActivityTypeCategory, "system">

export interface ActivityTypeWriteModel {
    name: string
    category: ActivityTypeCategoryWritable
    value: number
}

export interface ActivityType {
    id: number
    name: string
    category: ActivityTypeCategory
    value: number
    isEditable: boolean
}
