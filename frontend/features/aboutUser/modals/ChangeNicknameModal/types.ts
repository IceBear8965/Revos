import { Dispatch, SetStateAction } from "react"

export interface ChangeNicknameModalProps {
    modalVisible: boolean
    setModalVisible: Dispatch<SetStateAction<boolean>>
}
