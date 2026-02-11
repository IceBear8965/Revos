interface InitialEnergyType {
    icon: "emoticon-sad-outline" | "emoticon-neutral-outline" | "emoticon-happy-outline"
    state: "very_tired" | "normal" | "full"
}

interface LoadOrderElementType {
    id: number
    label: string
    icon: string
    key: string
}

interface RegisterPayloadType {
    email: string
    password: string
    nickname: string
    timezone: string
    loadOrder: LoadOrderElementType[]
    initialEnergyState: InitialEnergyType
}

interface RegisterResponseType {
    access: string
    refresh: string
}

export { InitialEnergyType, LoadOrderElementType, RegisterPayloadType, RegisterResponseType }
