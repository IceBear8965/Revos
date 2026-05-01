import { ActivityTypeDTO } from "../api/types"
import { ActivityType } from "./types"

export const mapActivityType = (dto: ActivityTypeDTO): ActivityType => ({
    id: dto.id,
    name: dto.name,
    category: dto.category,
    value: dto.value,
    isEditable: dto.is_editable,
})
