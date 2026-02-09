type initialEnergyType = "very_tired" | "normal" | "full"

interface PayloadType {
    email: string
    password: string
    nickname: string
    timezone: string
    loadOrder: Array<string>
    initialEnergyState: initialEnergyType
}

export { initialEnergyType, PayloadType }
