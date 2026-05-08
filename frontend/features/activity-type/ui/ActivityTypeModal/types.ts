import { ActivityType } from "@/entities/activity-type/model/types"

export interface ActivityTypeModalProps {
    mode: "create" | "edit"
    refetch: () => Promise<void>
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    activity: ActivityType
}
