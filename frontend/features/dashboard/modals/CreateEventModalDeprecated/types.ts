import React from "react"
import { LastEvent } from "../../types"
import { ActivityTypeKey } from "@/shared/constants"

interface CreateEventProps {
    activityType: ActivityTypeKey
    startedAt: Date
    endedAt: Date
    subjectiveCoef: number
}

interface CreateEventResponse {
    id: number
    eventType: "load" | "recovery"
    activityType: ActivityTypeKey
    startedAt: Date
    endedAt: Date
    energyBefore: number
    energyDelta: number
    energyAfter: number
    subjectiveCoef: number
}

interface CreateEventModalType {
    refetch: () => Promise<void>
    event_type: "load" | "recovery"
    lastEvent?: LastEvent | null
    modalVisible: boolean
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

interface EditEventModalType {}

export { CreateEventProps, CreateEventResponse, CreateEventModalType, EditEventModalType }
