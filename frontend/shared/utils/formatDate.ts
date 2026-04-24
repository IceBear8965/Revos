export const getWeekday = (date: Date) => {
    const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

    const dayIndex = date.getDay()
    return weekdays[dayIndex]
}

export const formatDateDDMM = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")

    return `${day}.${month}`
}
