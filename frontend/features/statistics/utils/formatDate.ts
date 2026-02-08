export const formatDate = (date: Date): string => {
    return date.toLocaleDateString([], { day: "2-digit", month: "2-digit" })
}
