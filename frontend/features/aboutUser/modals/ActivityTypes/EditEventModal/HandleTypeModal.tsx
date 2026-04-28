import { useEffect, useRef, useState } from "react"
import { Pressable, Text, View, Animated, PanResponder, Dimensions, TextInput } from "react-native"
import { useTheme } from "@/context/ThemeContext"
import { Alert } from "react-native"
import { useTabBar } from "@/context/TabBarContext"
import { useActivityTypes } from "@/context/ActivityTypesContext"
import { Loader } from "@/shared/components/Loader"
import { createStyles } from "./styles"
import { HandleTypeModalProps } from "./types"
import DropDownPicker from "react-native-dropdown-picker"
import { ActivityCoefSelector } from "./ActivityCoefSelector"
import { useEditType } from "./hooks/useEditType"

const SCREEN_HEIGHT = Dimensions.get("window").height

export const HandleTypeModal = ({
    activity_type,
    modalVisible,
    setModalVisible,
}: HandleTypeModalProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)
    const { setVisible } = useTabBar()
    const { types, isLoading: isTypesLoading, refetch: refetchActivities } = useActivityTypes()
    const { isLoading, error, refetch: editActivityType } = useEditType()

    const [name, setName] = useState<string>("")
    const [activityCategory, setActivityCategory] = useState<"load" | "recovery">("load")
    const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false)

    const [activityCoef, setActivityCoef] = useState<number>(1.0)

    const items = [
        { label: "Load", value: "load" },
        { label: "Recovery", value: "recovery" },
    ]

    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current
    const [isOpen, setIsOpen] = useState(false)

    const open = () => {
        setIsOpen(true)
        setVisible(false)
        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start()
    }

    const close = () => {
        Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            setIsOpen(false)
            setModalVisible(false)
            setVisible(true)
        })
    }

    useEffect(() => {
        if (modalVisible) open()
        else close()
    }, [modalVisible])

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) translateY.setValue(g.dy)
            },
            onPanResponderRelease: (_, g) => {
                if (g.dy > 120) close()
                else open()
            },
        })
    ).current

    const updateActivityType = async () => {
        try {
            await editActivityType({
                id: activity_type.id,
                name: name,
                category: activityCategory,
                value: activityCoef,
            })
            await refetchActivities()
            close()
        } catch (error) {
            console.log(error)
            Alert.alert("Error", "Failed to edit activity")
        }
    }

    // Init modal
    useEffect(() => {
        setName(activity_type.name)
        setActivityCategory(activity_type.category)
        setActivityCoef(activity_type.value)
    }, [modalVisible, activity_type])

    if (!isOpen) return null
    if (isLoading) return <Loader message="Updating selected activity" />
    if (isTypesLoading) return <Loader message="Loading your activities" />

    return (
        <View
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999,
            }}
        >
            {/* Press on background to close modal */}
            <Pressable
                onPress={close}
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                }}
            />
            {/* SHEET */}
            <Animated.View
                style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    height: SCREEN_HEIGHT * 0.4,
                    backgroundColor: colors.background,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    transform: [{ translateY }],
                }}
            >
                <View style={{ flex: 1 }}>
                    <View
                        {...panResponder.panHandlers}
                        style={{
                            height: 30,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <View
                            style={{
                                width: 40,
                                height: 5,
                                borderRadius: 3,
                                backgroundColor: colors.textPrimary,
                            }}
                        />
                    </View>

                    {/* HEADER */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Activity Type</Text>

                        <Pressable onPress={updateActivityType} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </Pressable>
                    </View>

                    <View style={styles.modalContentContainer}>
                        <View style={styles.modalContent}>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={colors.textPrimary}
                                autoCapitalize="none"
                                onChangeText={setName}
                                value={name}
                            />

                            <DropDownPicker
                                style={{
                                    backgroundColor: colors.card,
                                    borderColor: colors.topBar,
                                    borderRadius: 12,
                                    marginBottom: 20,
                                }}
                                textStyle={{
                                    color: colors.textPrimary,
                                    fontSize: 16,
                                }}
                                dropDownContainerStyle={{
                                    backgroundColor: colors.card,
                                    borderColor: colors.topBar,
                                    borderRadius: 12,
                                }}
                                arrowIconStyle={{
                                    tintColor: colors.textPrimary,
                                }}
                                tickIconStyle={{
                                    tintColor: colors.textPrimary,
                                }}
                                open={isDropDownOpen}
                                value={activityCategory}
                                setValue={setActivityCategory}
                                items={items}
                                setOpen={setIsDropDownOpen}
                            />

                            <ActivityCoefSelector
                                eventType={activityCategory}
                                value={activityCoef}
                                onChange={setActivityCoef}
                            />
                        </View>
                    </View>
                </View>
            </Animated.View>
        </View>
    )
}
