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
