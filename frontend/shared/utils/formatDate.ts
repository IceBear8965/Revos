export const formatEventDateTime = (startDate: Date, endDate: Date) => {
    return {
        startDate: startDate.toLocaleDateString([], {
            day: "2-digit",
            month: "2-digit",
        }),
        startTime: startDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }),
        endDate: endDate.toLocaleDateString([], {
            day: "2-digit",
            month: "2-digit",
        }),
        endTime: endDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }),
    }
}

export const getWeekday = (date: Date) => {
    const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

    const dayIndex = date.getDay()
    return weekdays[dayIndex]
}

export const formatDateDDMM = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")

    return `${day}.${month}`
}

export const formatDateForApi = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
}
