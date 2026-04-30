import React from "react"
import { EventType } from "@/shared/types"

interface EditEventProps {
    activity: number
    startedAt: Date
    endedAt: Date
    subjectiveCoef: number
}

interface EditEventResponse {
    id: number
    eventType: "load" | "recovery" | "system"
    activityType: string
    startedAt: Date
    endedAt: Date
    energyBefore: number
    energyDelta: number
    energyAfter: number
    subjectiveCoef: number
}

interface EditEventModalType {
    refetch: () => Promise<void>
    event: EventType
    modalVisible: boolean
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export { EditEventProps, EditEventResponse, EditEventModalType }
