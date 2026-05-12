import { ActivityType } from "@/entities/activity-type/model/types"
import { Dispatch, SetStateAction } from "react"

interface ActivityTypePickerProps<T> {
    dropDownValues: ActivityType[] | null
    isDropDownOpen: boolean
    dropDownValue: number | null
    setIsDropDownOpen: Dispatch<SetStateAction<boolean>>
    setDropDownValue: Dispatch<SetStateAction<T | null>>
}

export { ActivityTypePickerProps }
