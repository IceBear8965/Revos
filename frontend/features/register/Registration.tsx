import { useState, useEffect } from "react"
import { Alert, useWindowDimensions } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"
import { CredentialsStep } from "./components/credentials_step/CredentialsStep"
import { LoadsOrderStep } from "./components/loads_order_step/LoadsOrderStep"
import { CurrentStateStep } from "./components/current_state_step/CurrentStateStep"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { useTheme } from "@/context/ThemeContext"
import { getTimeZone } from "react-native-localize"
import { RegisterPayloadType } from "./types"
import { mapToLoadOrder } from "@/shared/utils/mapActivityTypes"
import { LOAD_ACTIVITIES } from "@/shared/constants"
import { InitialEnergyType, LoadOrderElementType } from "./types"
import { useRegistration } from "./hooks/useRegistration"
import { useAuth } from "@/context/AuthContext"
import { Error } from "@/shared/components/Error"

const initialLoadOrder = mapToLoadOrder([...LOAD_ACTIVITIES])

const initialEnergyState: InitialEnergyType = { icon: "emoticon-neutral-outline", state: "normal" }

export const Registration = () => {
    const { isLoading, error, refetch } = useRegistration()
    const { isAuth, authenticateFromTokens } = useAuth()
    const router = useRouter()
    const [payload, setPayload] = useState<RegisterPayloadType>({
        email: "",
        password: "",
        nickname: "",
        timezone: getTimeZone(),
        loadOrder: initialLoadOrder,
        initialEnergyState: initialEnergyState,
    })
    const [step, setStep] = useState<number>(0)
    const nextStep = () => {
        setStep(Math.min(step + 1, 2))
    }
    const prevStep = () => setStep(Math.max(step - 1, 0))

    const { colors } = useTheme()

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

    const register = async () => {
        try {
            await refetch(payload)

            await authenticateFromTokens()
            if (!isLoading) {
                if (isAuth) {
                    router.replace("/(tabs)")
                } else {
                    router.replace("/(auth)/login")
                }
            }
        } catch (err) {
            const message =
                typeof err === "object" && err !== null && "message" in err
                    ? (err as { message: string }).message
                    : "Unknown error"

            Alert.alert("Changing load order failed", message)
        }
    }

    const { width: SCREEN_WIDTH } = useWindowDimensions()
    const translateX = useSharedValue(0)

    useEffect(() => {
        translateX.value = withTiming(-step * SCREEN_WIDTH)
    }, [step])

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }))

    if (error) return <Error error={error} />

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
