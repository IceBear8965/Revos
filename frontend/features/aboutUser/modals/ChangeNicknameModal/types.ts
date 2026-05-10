import { Dispatch, SetStateAction } from "react"

export interface ChangeNicknameModalProps {
    refetch: () => Promise<void>
    modalVisible: boolean
    setModalVisible: Dispatch<SetStateAction<boolean>>
}
