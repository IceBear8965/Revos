interface ChangeNicknameModalProps {
    modalVisible: boolean
    setModalVisible: (v: boolean) => void
    currentNickname: string | undefined
    onSuccess: () => void
}

interface ChangeNicknameProps {
    nickname: string
}
interface ChangeNicknameResponseType {
    newNickname: string
}

export { ChangeNicknameModalProps, ChangeNicknameProps, ChangeNicknameResponseType }
