import { useCallback, useEffect, useState } from "react"
import { View, Text, Pressable, Image, Switch, Alert, FlatList } from "react-native"
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
import { useActivityTypes } from "@/context/ActivityTypesContext"
import { ActivityTypeDTO } from "@/api/types"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import DropDownPicker from "react-native-dropdown-picker"

export const AboutUser = () => {
    const { data, isLoading, error, refetch } = useAboutUser()
    const { signOut } = useAuth()
    const { theme, toggleTheme, colors } = useTheme()
    const { types, isLoading: isTypesLoading } = useActivityTypes()
    const styles = createStyles(colors)
    const [nicknameModalVisible, setNicknameModalVisible] = useState(false)
    const [timezoneModalVisible, setTimezoneModalVisible] = useState(false)
    const router = useRouter()

    const [dropDownValue, setDropDownValue] = useState<"load" | "recovery">()
    const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false)

    useFocusEffect(
        useCallback(() => {
            refetch()
        }, [])
    )

    const refetchOnSuccess = () => {
        refetch()
    }

    interface Choices {
        icon: "emoticon-sad-outline" | "emoticon-neutral-outline" | "emoticon-happy-outline"
        value: number
    }

    const iconsLoad: Choices[] = [
        { icon: "emoticon-sad-outline", value: 1.15 },
        { icon: "emoticon-neutral-outline", value: 1.0 },
        { icon: "emoticon-happy-outline", value: 0.85 },
    ]
    const iconsRecovery: Choices[] = [
        { icon: "emoticon-sad-outline", value: 0.85 },
        { icon: "emoticon-neutral-outline", value: 1.0 },
        { icon: "emoticon-happy-outline", value: 1.15 },
    ]

    if (isLoading) return <Loader message="Collecting data about you" />
    if (isTypesLoading) return <Loader message="Loading your activities" />
    if (error) return <Error error={error} />

    const renderActivityCard = ({ item }: { item: ActivityTypeDTO }) => {
        const icons = item.category === "load" ? iconsLoad : iconsRecovery
        const activeIconColor = item.category === "load" ? colors.accentRed : colors.accentGreen

        return (
            <Pressable
                style={[{ opacity: item.is_editable ? 1 : 0.5 }, styles.activityTypeCard]}
                onPress={() => console.log(item.name)}
            >
                <Text style={styles.activityTypeName}>{item.name}</Text>
                <View style={{ justifyContent: "flex-start", flexDirection: "row" }}>
                    <Text
                        style={[
                            {
                                backgroundColor:
                                    item.category === "load"
                                        ? colors.accentRed
                                        : colors.accentGreen,
                            },
                            styles.activityTypeCategory,
                        ]}
                    >
                        {item.category}
                    </Text>
                </View>
                <View style={styles.valueIndicatorContainer}>
                    {icons.map((icon, index) => {
                        const isActive = icon.value === item.value
                        return (
                            <View
                                key={index}
                                style={[
                                    {
                                        backgroundColor: isActive ? activeIconColor : "transparent",
                                    },
                                    styles.valueIndicator,
                                ]}
                            >
                                <MaterialCommunityIcons
                                    name={icon.icon}
                                    size={36}
                                    color={colors.textPrimary}
                                />
                            </View>
                        )
                    })}
                </View>
            </Pressable>
        )
    }

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
            </View>

            <View style={styles.activityTypesContainer}>
                <FlatList
                    data={types}
                    renderItem={renderActivityCard}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                    }}
                    ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                    ListFooterComponent={<View style={{ height: 10 }} />}
                    showsVerticalScrollIndicator={true}
                />
            </View>

            <View style={styles.signOutContainer}>
                <Pressable style={styles.signOutButton} onPress={signOut}>
                    <Text style={styles.signOutButtonText}>Sign Out</Text>
                </Pressable>
            </View>

            {/* Modals */}
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
