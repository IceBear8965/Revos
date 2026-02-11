import { formatDate } from "./formatDate"

interface ActivityType {
    date: Date
    energy: number | null
}
interface MappedEnergyType {
    date: string
    energy: number | null
    [key: string]: unknown
}

export const mapEnergyOverview = (activities?: ActivityType[]): MappedEnergyType[] => {
    return (activities ?? []).map((el) => {
        return {
            date: formatDate(el.date),
            energy: el.energy,
        }
    })
}
