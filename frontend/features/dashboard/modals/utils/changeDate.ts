const setDatePart = (existingDate: Date, newDate: Date) =>
    new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate(),
        existingDate.getHours(),
        existingDate.getMinutes(),
        existingDate.getSeconds()
    )

const setTimePart = (existingDate: Date, newTime: Date) =>
    new Date(
        existingDate.getFullYear(),
        existingDate.getMonth(),
        existingDate.getDate(),
        newTime.getHours(),
        newTime.getMinutes(),
        newTime.getSeconds()
    )

export { setDatePart, setTimePart }
