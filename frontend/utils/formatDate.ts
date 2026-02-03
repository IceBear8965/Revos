export const formatEventDateTime = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)

    return {
        date: startDate.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }),
        startTime: startDate.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
        }),
        endTime: endDate.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
        }),
    }
}
