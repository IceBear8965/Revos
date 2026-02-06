export const formatEventDateTime = (startDate: Date, endDate: Date) => {
    return {
        date: startDate.toLocaleDateString([], {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }),
        startTime: startDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }),
        endTime: endDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }),
    }
}
