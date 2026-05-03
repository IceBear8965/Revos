export const toDate = (value: string) => {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date: ${value}`)
    }
    return date
}
