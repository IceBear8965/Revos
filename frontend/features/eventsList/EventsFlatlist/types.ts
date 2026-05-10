import { Event } from "@/entities/event/model/types"

export interface EventsFlatlistProps {
    selectedDate: Date
    onEdit: (event: Event) => void
    onDelete: (id: number) => void
}
