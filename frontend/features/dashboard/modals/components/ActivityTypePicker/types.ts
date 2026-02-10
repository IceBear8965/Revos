import { ActivityTypeKey } from "@/shared/constants"
import { Dispatch, SetStateAction } from "react"

interface ModalTopProps {
    event_type: "load" | "recovery"
    isDropDownOpen: boolean
    dropDownValue: string | null
    setIsDropDownOpen: Dispatch<SetStateAction<boolean>>
    setDropDownValue: Dispatch<SetStateAction<ActivityTypeKey | null>>
    closeModal: () => void
}

export { ModalTopProps }
