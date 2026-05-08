import { ActivityTypeCategoryWritable } from "@/entities/activity-type/model/types"
import { Dispatch, SetStateAction } from "react"

export interface ActivityFormProps {
    activityName: string | null
    activityCategory: ActivityTypeCategoryWritable
    activityValue: number
    setActivityName: Dispatch<SetStateAction<string | null>>
    setActivityCategory: Dispatch<SetStateAction<ActivityTypeCategoryWritable>>
    setActivityValue: Dispatch<SetStateAction<number>>
}

export interface Choices {
    icon: "emoticon-sad-outline" | "emoticon-neutral-outline" | "emoticon-happy-outline"
    value: number
}
