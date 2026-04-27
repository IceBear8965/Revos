import React from "react"

interface ConfirmationModalProps {
    title: string
    onConfirm: () => void // Callback function for confirm button
    onDeny: () => void // Callback function for decline button
    modalVisible: boolean
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export { ConfirmationModalProps }
