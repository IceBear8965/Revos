import { useCallback, useEffect, useState } from "react"
import { View, Text, Pressable, Image, Switch, Alert, FlatList } from "react-native"
import { useRouter, useFocusEffect } from "expo-router"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import AntDesign from "@expo/vector-icons/AntDesign"
import { useTheme } from "@/context/ThemeContext"
import { useAboutUser } from "./hooks/useAboutUser"
import { Loader } from "@/shared/components/Loader"
import { Error } from "@/shared/components/Error"
import { createStyles } from "./aboutUser.style"
import { useAuth } from "@/context/AuthContext"
import { useActivityTypes } from "@/context/ActivityTypesContext"
import { useDeleteType } from "../activity-type/model/useDeleteType"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ConfirmationModal } from "@/shared/components/ConfirmationModal/ConfirmationModal"
import { ActivityType } from "@/entities/activity-type/model/types"
import { ActivityTypeModal } from "../activity-type/ui/ActivityTypeModal/ActivityTypeModal"
import { ChangeNicknameModal } from "./modals/ChangeNicknameModal/ChangeNicknameModal"

export const AboutUser = () => {
    const { data, isLoading, error, execute: fetchAboutUser } = useAboutUser()
    const { signOut } = useAuth()
    const { theme, toggleTheme, colors } = useTheme()
    const { types, isLoading: isTypesLoading, refetch: updateActivityTypes } = useActivityTypes()
    const { isLoading: isDeleting, execute: deleteActivityType } = useDeleteType()
    const styles = createStyles(colors)

    // Modals
    const [nicknameModalVisible, setNicknameModalVisible] = useState<boolean>(false)
    const [timezoneModalVisible, setTimezoneModalVisible] = useState<boolean>(false)

    // Activity types modals
    const [activityTypeModalVisible, setActivityTypeModalVisible] = useState<boolean>(false)
    const [activityTypeModalMode, setActivityTypeModalMode] = useState<"create" | "edit">("create")
    const [selectedActivityType, setSelectedActivityType] = useState<ActivityType>({
        id: 0,
        name: "",
        category: "load",
        value: 1.0,
        isEditable: false,
    })

    const [deleteActivityTypeModal, setDeleteActivityTypeModal] = useState<boolean>(false)
    const [typeToDelete, setTypeToDelete] = useState<number | null>(null)

    const router = useRouter()

    useFocusEffect(
        useCallback(() => {
            fetchAboutUser()
        }, [])
    )

    const refetchOnSuccess = async (): Promise<void> => {
        await fetchAboutUser()
        await updateActivityTypes()
    }

    const onDeleteConfirmed = async () => {
        if (typeToDelete) {
            try {
                await deleteActivityType(typeToDelete)
                refetchOnSuccess()
                setTypeToDelete(null)
                setDeleteActivityTypeModal(false)
            } catch (error) {
                Alert.alert("Error", "Activity Type can't be deleted now", [
                    { text: "Close", onPress: () => onDeleteDenied(), style: "default" },
                ])
            }
        } else {
            setDeleteActivityTypeModal(false)
        }
    }
    const onDeleteDenied = () => {
        setTypeToDelete(null)
        setDeleteActivityTypeModal(false)
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

    const renderActivityCard = ({ item }: { item: ActivityType }) => {
        const icons = item.category === "load" ? iconsLoad : iconsRecovery
        const activeIconColor = item.category === "load" ? colors.accentRed : colors.accentGreen

        return (
            <View style={[{ opacity: item.isEditable ? 1 : 0.5 }, styles.activityTypeCard]}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Text style={styles.activityTypeName}>{item.name}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Pressable
                            onPress={() => {
                                if (item.isEditable) {
                                    setSelectedActivityType(item)
                                    setActivityTypeModalMode("edit")
                                    setActivityTypeModalVisible(true)
                                }
                            }}
                            style={{ marginRight: 10 }}
                        >
                            <FontAwesome6
                                name="pen-to-square"
                                color={colors.textPrimary}
                                size={24}
                            />
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                if (item.isEditable) {
                                    setTypeToDelete(item.id)
                                    setDeleteActivityTypeModal(true)
                                }
                            }}
                        >
                            <FontAwesome6 name="trash-can" size={24} color={colors.textPrimary} />
                        </Pressable>
                    </View>
                </View>
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
                                style={{
                                    backgroundColor: isActive ? activeIconColor : "transparent",
                                    padding: 8,
                                    borderRadius: 20,
                                    overflow: "hidden",
                                }}
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
            </View>
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
                <View style={styles.addTypeContainer}>
                    <Pressable
                        style={styles.addTypeBtn}
                        onPress={() => {
                            setActivityTypeModalMode("create")
                            setActivityTypeModalVisible(true)
                        }}
                    >
                        <Text style={styles.addTypeBtnText}>Add Activity Type</Text>
                        <AntDesign name="plus-circle" size={24} color={colors.textPrimary} />
                    </Pressable>
                </View>
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
                    showsVerticalScrollIndicator={false}
                />
            </View>

            <View style={styles.signOutContainer}>
                <Pressable style={styles.signOutButton} onPress={signOut}>
                    <Text style={styles.signOutButtonText}>Sign Out</Text>
                </Pressable>
            </View>

            {/* Modals */}
            <ActivityTypeModal
                mode={activityTypeModalMode}
                refetch={refetchOnSuccess}
                isOpen={activityTypeModalVisible}
                setIsOpen={setActivityTypeModalVisible}
                activity={selectedActivityType}
            />

            <ConfirmationModal
                title="Are you sure you want to delete selected activity?"
                onConfirm={onDeleteConfirmed}
                onDeny={onDeleteDenied}
                modalVisible={deleteActivityTypeModal}
                setModalVisible={setDeleteActivityTypeModal}
            />

            <ChangeNicknameModal
                modalVisible={nicknameModalVisible}
                setModalVisible={setNicknameModalVisible}
            />
        </View>
    )
}
