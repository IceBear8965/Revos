interface SubjectiveCoefSelectorProps {
    eventType: "load" | "recovery"
    subjectiveCoef: number
    onChange: (value: number) => void
}

interface Choices {
    icon: "emoticon-sad-outline" | "emoticon-neutral-outline" | "emoticon-happy-outline"
    value: number
}

export { SubjectiveCoefSelectorProps, Choices }
