import { LoadOrderElementType } from "../register/types"

interface AboutUserResponseType {
    userId: number
    email: string
    nickname: string
    timezone: string
    loadOrder: string[]
}

interface ChangeLoadOrderPayloadType {
    loadOrder: LoadOrderElementType[]
}
interface ChangeLoadOrderResponseType {
    loadOrder: string[]
}

export { AboutUserResponseType, ChangeLoadOrderPayloadType, ChangeLoadOrderResponseType }
