interface ChangeTimezoneModalProps {
    modalVisible: boolean
    setModalVisible: (v: boolean) => void
    currentTimezone: string | undefined
    onSuccess: () => void
}

interface ChangeTimezoneProps {
    timezone: string
}
interface ChangeTimezoneResponseType {
    newTimezone: string
}

export { ChangeTimezoneModalProps, ChangeTimezoneProps, ChangeTimezoneResponseType }
