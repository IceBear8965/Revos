import { View } from "react-native"
import Feather from "@expo/vector-icons/Feather"
import { useTheme } from "@/context/ThemeContext"
import { ArrowsRendererProps } from "./types"

export const ArrowsRenderer = ({ energyDelta }: ArrowsRendererProps) => {
    const { colors } = useTheme()

    const absDelta = Math.abs(energyDelta)

    const arrowColor = energyDelta >= 0 ? colors.accentGreen : colors.accentRed

    const arrowName = energyDelta >= 0 ? "arrow-up" : "arrow-down"

    let arrowsCount = 0

    if (absDelta < 0.1) {
        arrowsCount = 1
    } else if (absDelta < 0.3) {
        arrowsCount = 2
    } else {
        arrowsCount = 3
    }

    return (
        <View style={{ flexDirection: "row" }}>
            {Array.from({ length: arrowsCount }).map((_, index) => (
                <Feather key={index} name={arrowName} size={30} color={arrowColor} />
            ))}
        </View>
    )
}
