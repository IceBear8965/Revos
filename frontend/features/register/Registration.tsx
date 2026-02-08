import { useState, useEffect } from "react"
import { useWindowDimensions } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"
import { CredentialsStep } from "./components/credentials_step/CredentialsStep"
import { LoadsOrderStep } from "./components/loads_order_step/LoadsOrderStep"
import { CurrentStateStep } from "./components/current_state_step/CurrentStateStep"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/context/ThemeContext"

export const Registration = () => {
    const [step, setStep] = useState<number>(0)
    const nextStep = () => setStep(Math.min(step + 1, 2))
    const prevStep = () => setStep(Math.max(step - 1, 0))

    const { colors } = useTheme()

    const { width: SCREEN_WIDTH } = useWindowDimensions()
    const translateX = useSharedValue(0)

    useEffect(() => {
        translateX.value = withTiming(-step * SCREEN_WIDTH)
    }, [step])

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }))

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.background,
            }}
        >
            <Animated.View
                style={[{ flex: 1, flexDirection: "row", width: SCREEN_WIDTH * 3 }, animatedStyle]}
            >
                <LoadsOrderStep prevStep={prevStep} nextStep={nextStep} />
                <CredentialsStep nextStep={nextStep} />
                <CurrentStateStep />
            </Animated.View>
        </SafeAreaView>
    )
}
