interface InitialEnergyType {
    icon: "emoticon-sad-outline" | "emoticon-neutral-outline" | "emoticon-happy-outline"
    state: "very_tired" | "normal" | "full"
}

interface PayloadType {
    email: string
    password: string
    nickname: string
    timezone: string
    loadOrder: LoadOrderElementType[]
    initialEnergyState: InitialEnergyType
}

interface LoadOrderElementType {
    id: number
    label: string
    icon: string
}

export { InitialEnergyType, PayloadType, LoadOrderElementType }
