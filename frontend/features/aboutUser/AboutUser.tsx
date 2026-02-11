import { useCallback, useState } from "react"
import { View, Text, Pressable, Image } from "react-native"
import { useRouter, useFocusEffect } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import { useTheme } from "@/context/ThemeContext"
import { useAboutUser } from "./hooks/useAboutUser"
import { Loader } from "@/shared/components/Loader"
import { Error } from "@/shared/components/Error"
import { createStyles } from "./aboutUser.style"
import { ChangeNicknameModal } from "./components/changeNicknameModal/ChangeNicknameModal"

export const AboutUser = () => {
    const { data, isLoading, error, refetch } = useAboutUser()
    const { colors } = useTheme()
    const styles = createStyles(colors)
    const [modalVisible, setModalVisible] = useState(false)
    const router = useRouter()

    useFocusEffect(
        useCallback(() => {
            refetch()
        }, [])
    )

    const refetchOnSuccess = async () => {
        await refetch()
    }

    if (isLoading) return <Loader />
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
