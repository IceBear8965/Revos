import { ActivityType } from "@/entities/activity-type/model/types"
import { Dispatch, SetStateAction } from "react"

interface ActivityTypePickerProps {
    dropDownValues: ActivityType[] | null
    isDropDownOpen: boolean
    dropDownValue: number | null
    setIsDropDownOpen: Dispatch<SetStateAction<boolean>>
    setDropDownValue: (v: number) => void
}

export { ActivityTypePickerProps }
