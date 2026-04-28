import { ActivityTypeDTO } from "@/api/types"
import { SetStateAction } from "react"

interface HandleTypeModalProps {
    activity_type: ActivityTypeDTO
    modalVisible: boolean
    setModalVisible: React.Dispatch<SetStateAction<boolean>>
}

interface EditTypeProps {
    id: number // Passed into url as id param for function
    name: string
    category: "load" | "recovery"
    value: number
}

export { HandleTypeModalProps, EditTypeProps }
