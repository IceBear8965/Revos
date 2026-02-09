import { useState, useEffect } from "react"
import { useWindowDimensions } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"
import { CredentialsStep } from "./components/credentials_step/CredentialsStep"
import { LoadsOrderStep } from "./components/loads_order_step/LoadsOrderStep"
import { CurrentStateStep } from "./components/current_state_step/CurrentStateStep"
import { SafeAreaView } from "react-native-safe-area-context"
import { getTimeZone } from "react-native-localize"
import { useTheme } from "@/context/ThemeContext"
import { PayloadType } from "./types"
import { LOAD_ACTIVITIES } from "@/shared/constants"
import { InitialEnergyType, LoadOrderElementType } from "./types"

const initialLoadOrder = LOAD_ACTIVITIES.map((el, i) => {
    return {
        id: i,
        icon: el.icon,
        label: el.activity,
    }
})

const initialEnergyState: InitialEnergyType = { icon: "emoticon-neutral-outline", state: "normal" }

export const Registration = () => {
    const [payload, setPayload] = useState<PayloadType>({
        email: "",
        password: "",
        nickname: "",
        timezone: getTimeZone() ? getTimeZone() : "UTC",
        loadOrder: initialLoadOrder,
        initialEnergyState: initialEnergyState,
    })
    const [step, setStep] = useState<number>(0)
    const nextStep = () => {
        setStep(Math.min(step + 1, 2))
    }
    const prevStep = () => setStep(Math.max(step - 1, 0))

    const setNickname = (nickname: string) => {
        setPayload({
            ...payload,
            nickname: nickname,
        })
    }
    const setEmail = (email: string) => {
        setPayload({
            ...payload,
            email: email,
        })
    }
    const setPassword = (password: string) => {
        setPayload({
            ...payload,
            password: password,
        })
    }
    const setLoadOrder = (loadOrder: LoadOrderElementType[]) => {
        setPayload({
            ...payload,
            loadOrder: loadOrder,
        })
    }
    const setInitialState = (currentState: InitialEnergyType) => {
        setPayload({
            ...payload,
            initialEnergyState: currentState,
        })
    }

    const register = () => {
        console.log(payload)
    }

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
                <CredentialsStep
                    nickname={payload.nickname}
                    email={payload.email}
                    password={payload.password}
                    setNickname={setNickname}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    nextStep={nextStep}
                />
                <LoadsOrderStep
                    loadOrder={payload.loadOrder}
                    prevStep={prevStep}
                    nextStep={nextStep}
                    setLoadOrder={setLoadOrder}
                />
                <CurrentStateStep
                    initialState={payload.initialEnergyState}
                    setInitialState={setInitialState}
                    prevStep={prevStep}
                    register={register}
                />
            </Animated.View>
        </SafeAreaView>
    )
}
