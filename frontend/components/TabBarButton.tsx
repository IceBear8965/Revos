import { useTheme } from "@/context/ThemeContext"
import { Pressable, StyleSheet } from "react-native"
import { JSX, useEffect } from "react"
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated"
import Feather from "@expo/vector-icons/Feather"
import AntDesign from "@expo/vector-icons/AntDesign"
import { useTabBar } from "@/context/TabBarContext"

type TabRouteName = "index" | "stats" | "list"

const icons: Record<TabRouteName, (color: string) => JSX.Element> = {
    index: (color) => <Feather name="home" size={24} color={color} />,
    stats: (color) => <AntDesign name="bar-chart" size={24} color={color} />,
    list: (color) => <AntDesign name="unordered-list" size={24} color={color} />,
}
interface TabBarButtonProps {
    onPress: () => void
    isFocused: boolean
    routeName: TabRouteName
    label: string
}

export const TabBarButton = ({ onPress, isFocused, routeName, label }: TabBarButtonProps) => {
    const { colors } = useTheme()
    const { setIconReady } = useTabBar()

    const scale = useSharedValue(0)

    // Animate icon when focused/unfocused
    useEffect(() => {
        scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 })
        setIconReady()
    }, [isFocused])

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(scale.value, [0, 1], [1, 1.2]) }],
        top: interpolate(scale.value, [0, 1], [0, 10]),
    }))

    const animatedTextStyle = useAnimatedStyle(() => ({
        opacity: interpolate(scale.value, [0, 1], [1, 0]),
    }))

    const color = isFocused ? colors.navigationActive : colors.navigationInactive

    return (
        <Pressable onPress={onPress} style={styles.button}>
            <Animated.View style={animatedIconStyle}>{icons[routeName](color)}</Animated.View>
            <Animated.Text style={[styles.label, { color }, animatedTextStyle]}>
                {label}
            </Animated.Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
    },
    label: {
        fontSize: 12,
    },
})
