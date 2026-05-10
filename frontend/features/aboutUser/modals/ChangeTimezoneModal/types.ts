import { Dispatch, SetStateAction } from "react"

export interface ChangeTimezoneModalProps {
    refetch: () => Promise<void>
    modalVisible: boolean
    setModalVisible: Dispatch<SetStateAction<boolean>>
}
