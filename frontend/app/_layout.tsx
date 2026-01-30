import { Stack } from "expo-router"
import { useEffect } from "react"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import { ThemeProvider, useTheme } from "@/context/ThemeContext"
import { AnimationProvider } from "@/context/AnimationsContext"
import * as SplashScreen from "expo-splash-screen"
import { SafeAreaProvider } from "react-native-safe-area-context"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <AuthProvider>
                    <RootNavigator />
                </AuthProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    )
}

const RootNavigator = () => {
    const { isAuth, isLoading } = useAuth()
    const { isThemeReady } = useTheme()

    useEffect(() => {
        if (!isLoading && isThemeReady) {
            SplashScreen.hideAsync()
        }
    }, [isLoading, isThemeReady])

    if (isLoading || !isThemeReady) {
        return null
    }

    return (
        <Stack>
            <Stack.Protected guard={isAuth}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack.Protected>

            <Stack.Protected guard={!isAuth}>
                <Stack.Screen name="(auth)/Login" options={{ headerShown: false }} />
            </Stack.Protected>
        </Stack>
    )
}
