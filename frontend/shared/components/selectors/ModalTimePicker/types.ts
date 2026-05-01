import React from "react"

interface ModalTimePickerProps {
    startedAt: Date
    endedAt: Date
    setStartedAt: (date: Date) => void
    setEndedAt: (date: Date) => void
    resetSignal?: boolean
}

export { ModalTimePickerProps }
