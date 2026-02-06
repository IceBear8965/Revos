interface SubjectiveCoefSelectorProps {
    eventType: "load" | "recovery"
    subjectiveCoef: number
    onChange: (value: number) => void
}

export { SubjectiveCoefSelectorProps }
