import React from "react"
import { DashboardType } from "../../types"

interface CreateEventModalType {
    setData: React.Dispatch<React.SetStateAction<DashboardType | undefined>>
    event_type: "load" | "recovery"
    lastEvent?: DashboardType["lastEvent"] | null
    modalVisible: boolean
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export { CreateEventModalType }
