import { LastEvent } from "../../types"
import { ActivityTypeKey } from "@/shared/constants"

interface EditEventProps {
    id: number
    activityType: ActivityTypeKey
    startedAt: Date
    endedAt: Date
    subjectiveCoef: number
}

interface EditEventModalType {
    refetch: () => Promise<void>
    lastEvent: LastEvent | undefined | null
    modalVisible: boolean
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export { EditEventProps, EditEventModalType }
