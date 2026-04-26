import { ActivityTypeDTO } from "@/api/types"
import { SetStateAction } from "react"

interface EditTypeModalProps {
    activity_type: ActivityTypeDTO
    modalVisible: boolean
    setModalVisible: React.Dispatch<SetStateAction<boolean>>
}

export { EditTypeModalProps }
