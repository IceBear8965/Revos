import { ActivityTypeDTO } from "@/api/types"
import { Dispatch, SetStateAction } from "react"

interface ActivityTypePickerProps {
    dropDownValues: ActivityTypeDTO[] | null
    isDropDownOpen: boolean
    dropDownValue: number | null
    setIsDropDownOpen: Dispatch<SetStateAction<boolean>>
    setDropDownValue: Dispatch<SetStateAction<number | null>>
}

export { ActivityTypePickerProps }
