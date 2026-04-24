import { useCallback, useEffect, useState } from "react"
import { View, Text, Pressable, Image, Switch, Alert } from "react-native"
import { useRouter, useFocusEffect } from "expo-router"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import { useTheme } from "@/context/ThemeContext"
import { useAboutUser } from "./hooks/useAboutUser"
import { Loader } from "@/shared/components/Loader"
import { Error } from "@/shared/components/Error"
import { createStyles } from "./aboutUser.style"
import { ChangeNicknameModal } from "./components/changeNicknameModal/ChangeNicknameModal"
import { ChangeTimezoneModal } from "./components/changeTimezoneModal/ChangeTimezoneModal"
import { useAuth } from "@/context/AuthContext"

export const AboutUser = () => {
    const { data, isLoading, error, refetch } = useAboutUser()
    const { signOut } = useAuth()
    const { theme, toggleTheme, colors } = useTheme()
    const styles = createStyles(colors)
    const [nicknameModalVisible, setNicknameModalVisible] = useState(false)
    const [timezoneModalVisible, setTimezoneModalVisible] = useState(false)
    const router = useRouter()

    useFocusEffect(
        useCallback(() => {
            refetch()
        }, [])
    )

    const refetchOnSuccess = () => {
        refetch()
    }

    if (isLoading) return <Loader message="Collecting data about you" />
    if (error) return <Error error={error} />

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.aboutUserContainer}>
                <View style={styles.changeNicknameCard}>
                    <Pressable onPress={() => router.navigate("/(tabs)")}>
                        <Image
                            source={require("@/assets/icons/user_icon.png")}
                            style={styles.userIcon}
                        />
                    </Pressable>
                    <View style={styles.changeNicknameCardRight}>
                        <Text style={styles.nickname}>{data?.nickname}</Text>
                        <Pressable onPress={() => setNicknameModalVisible(true)}>
                            <FontAwesome6
                                name="pen-to-square"
                                size={24}
                                color={colors.textPrimary}
                            />
                        </Pressable>
                    </View>
                </View>

                <View style={styles.changeTimezoneContainer}>
                    <Text style={styles.timezoneSelectorText}>{data?.timezone}</Text>
                    <Pressable onPress={() => setTimezoneModalVisible(true)}>
                        <FontAwesome6 name="pen-to-square" size={24} color={colors.textPrimary} />
                    </Pressable>
                </View>

                <View style={styles.toggleThemeCard}>
                    <Text style={styles.themeSwitcherText}>{theme}</Text>
                    <Switch
                        style={styles.themeSwitcher}
                        onValueChange={toggleTheme}
                        value={theme === "dark" ? true : false}
                    />
                </View>
                <View style={styles.signOutContainer}>
                    <Pressable style={styles.signOutButton} onPress={signOut}>
                        <Text style={styles.signOutButtonText}>Sign Out</Text>
                    </Pressable>
                </View>
            </View>
            <ChangeNicknameModal
                currentNickname={data?.nickname}
                modalVisible={nicknameModalVisible}
                setModalVisible={setNicknameModalVisible}
                onSuccess={refetchOnSuccess}
            />
            <ChangeTimezoneModal
                currentTimezone={data?.timezone}
                modalVisible={timezoneModalVisible}
                setModalVisible={setTimezoneModalVisible}
                onSuccess={refetchOnSuccess}
            />
        </View>
    )
}
