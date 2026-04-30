import React from "react"

interface ModalTimePickerProps {
    startedAt: Date
    endedAt: Date
    setStartedAt: React.Dispatch<React.SetStateAction<Date>>
    setEndedAt: React.Dispatch<React.SetStateAction<Date>>
    resetSignal: boolean
}

export { ModalTimePickerProps }
