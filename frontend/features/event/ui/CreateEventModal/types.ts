import { ActivityTypeCategoryWritable } from "@/entities/activity-type/model/types"
import { Event } from "@/entities/event/model/types"

export interface CreateEventModalProps {
    refetch: () => Promise<void>
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    event: Event | null
    eventType: ActivityTypeCategoryWritable
}
