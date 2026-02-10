import { Stack } from "expo-router"
import { useEffect } from "react"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import { ThemeProvider, useTheme } from "@/context/ThemeContext"
import { TabBarProvider, useTabBar } from "@/context/TabBarContext"
import * as SplashScreen from "expo-splash-screen"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GestureHandlerRootView } from "react-native-gesture-handler"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <TabBarProvider>
                    <AuthProvider>
                        <GestureHandlerRootView style={{ flex: 1 }}>
                            <RootNavigator />
                        </GestureHandlerRootView>
                    </AuthProvider>
                </TabBarProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    )
}

const RootNavigator = () => {
    const { isAuth, isLoading, signOut } = useAuth()
    const { isThemeReady } = useTheme()
    // signOut()

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
                <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
            </Stack.Protected>
        </Stack>
    )
}
