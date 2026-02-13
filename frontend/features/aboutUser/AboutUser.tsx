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
import { LoadOrderList } from "@/shared/components/LoadOrderList"
import { mapToLoadOrder } from "@/shared/utils/mapActivityTypes"
import { LoadOrderElementType } from "../register/types"
import { ActivityTypeKey } from "@/shared/constants"
import { LOAD_ACTIVITIES } from "@/shared/constants"
import { useChangeLoadOrder } from "./hooks/useChangeLoadOrder"
import { useAuth } from "@/context/AuthContext"

export const AboutUser = () => {
    const { data, isLoading, error, refetch } = useAboutUser()
    const {
        isLoading: loadOrderLoading,
        error: loadOrderError,
        refetch: fetchLoadOrder,
    } = useChangeLoadOrder()
    const { signOut } = useAuth()
    const { theme, toggleTheme, colors } = useTheme()
    const styles = createStyles(colors)
    const [modalVisible, setModalVisible] = useState(false)
    const router = useRouter()

    const [loadOrder, setLoadOrder] = useState<LoadOrderElementType[]>([])
    useEffect(() => {
        if (data?.loadOrder) {
            const filtered: ActivityTypeKey[] = data.loadOrder.filter(
                (key): key is ActivityTypeKey => LOAD_ACTIVITIES.includes(key as ActivityTypeKey)
            )

            setLoadOrder(mapToLoadOrder(filtered))
        }
    }, [data])

    useFocusEffect(
        useCallback(() => {
            refetch()
        }, [])
    )

    const refetchOnSuccess = () => {
        refetch()
    }

    const saveLoadOrder = async () => {
        try {
            await fetchLoadOrder({ loadOrder })
        } catch (err) {
            const message =
                typeof err === "object" && err !== null && "message" in err
                    ? (err as { message: string }).message
                    : "Unknown error"

            Alert.alert("Changing load order failed", message)
        }
    }

    if (isLoading || loadOrderLoading) return <Loader message="Collecting data about you" />
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
                        <Pressable onPress={() => setModalVisible(true)}>
                            <FontAwesome6
                                name="pen-to-square"
                                size={24}
                                color={colors.textPrimary}
                            />
                        </Pressable>
                    </View>
                </View>
                <View style={styles.toggleThemeCard}>
                    <Text style={styles.themeSwitcherText}>{theme}</Text>
                    <Switch
                        style={styles.themeSwitcher}
                        onValueChange={toggleTheme}
                        value={theme === "dark" ? true : false}
                    />
                </View>

                <View style={styles.loadOrderSelectorContainer}>
                    {loadOrder && (
                        <>
                            <LoadOrderList loadOrder={loadOrder} setLoadOrder={setLoadOrder} />
                            <View style={styles.saveLoadOrderButtonContainer}>
                                <Pressable
                                    style={styles.saveLoadOrderButton}
                                    onPress={saveLoadOrder}
                                >
                                    <Text style={styles.saveLoadOrderText}>Save</Text>
                                </Pressable>
                            </View>
                        </>
                    )}
                </View>
                <View style={styles.signOutContainer}>
                    <Pressable style={styles.signOutButton} onPress={signOut}>
                        <Text style={styles.signOutButtonText}>Sign Out</Text>
                    </Pressable>
                </View>
            </View>

            <ChangeNicknameModal
                currentNickname={data?.nickname}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                onSuccess={refetchOnSuccess}
            />
        </View>
    )
}
