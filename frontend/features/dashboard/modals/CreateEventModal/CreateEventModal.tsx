import { useEffect, useRef, useState, useMemo } from "react"
import { Pressable, Text, View, Animated, PanResponder, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/context/ThemeContext"
import { ActivitiTypePicker } from "../components/ActivityTypePicker/ActivityTypePicker"
import { ModalTimePicker } from "../components/ModalTimePicker/ModalTimePicker"
import { SubjectiveCoefSelector } from "../components/SubjectiveCoefSelector/SubjectiveCoefSelector"
import { useCreateEvent } from "../../hooks/useCreateEvent"
import { ActivityTypeKey } from "@/shared/constants"
import { createStyles } from "./styles"
import { Alert } from "react-native"
import { useTabBar } from "@/context/TabBarContext"

const SCREEN_HEIGHT = Dimensions.get("window").height

export const CreateEventModal = ({
    refetch,
    event_type,
    lastEvent,
    modalVisible,
    setModalVisible,
}: any) => {
    const { colors } = useTheme()
    const { setVisible } = useTabBar()
    const styles = createStyles(colors)

    const { refetch: createEventPost, isLoading, error } = useCreateEvent()

    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current
    const [isOpen, setIsOpen] = useState(false)

    // Event type picker
    const [isDropDownOpen, setIsDropDownOpen] = useState(false)
    const [dropDownValue, setDropDownValue] = useState<ActivityTypeKey | null>(null)

    // Time picker
    const [startedAt, setStartedAt] = useState<Date>(new Date())
    const [endedAt, setEndedAt] = useState<Date>(new Date())
    const [resetSignal, setResetSignal] = useState<boolean>(false)

    // Subjective coef picker
    const [subjectiveCoef, setSubjectiveCoef] = useState(1.0)

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

    useEffect(() => {
        const startDate = lastEvent?.endedAt
        setStartedAt(startDate ?? new Date())
        setEndedAt(new Date())
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

    const createEvent = async () => {
        if (!dropDownValue) return

        try {
            await createEventPost({
                activityType: dropDownValue,
                startedAt,
                endedAt,
                subjectiveCoef,
            })

            await refetch()
            close()
        } catch (e) {
            console.log(e)
            Alert.alert("Error", "Failed to create event")
        }
    }

    if (!isOpen) return null

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
                    height: SCREEN_HEIGHT * 0.7,
                    backgroundColor: colors.background,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    transform: [{ translateY }],
                }}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <View
                        {...panResponder.panHandlers}
                        style={{
                            height: 10,
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
                        <Text style={styles.headerTitle}>New Event</Text>

                        <Pressable onPress={createEvent} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </Pressable>
                    </View>

                    {/* CONTENT */}
                    <View style={styles.modalContentContainer}>
                        <View style={styles.modalContent}>
                            {/* <ActivitiTypePicker */}
                            {/*     event_type={event_type} */}
                            {/*     isDropDownOpen={isDropDownOpen} */}
                            {/*     dropDownValue={dropDownValue} */}
                            {/*     setIsDropDownOpen={setIsDropDownOpen} */}
                            {/*     setDropDownValue={setDropDownValue} */}
                            {/*     closeModal={close} */}
                            {/* /> */}
                            {/**/}
                            {/* <ModalTimePicker */}
                            {/*     startedAt={startedAt} */}
                            {/*     endedAt={endedAt} */}
                            {/*     setStartedAt={setStartedAt} */}
                            {/*     setEndedAt={setEndedAt} */}
                            {/*     resetSignal={resetSignal} */}
                            {/* /> */}
                            {/**/}
                            {/* <SubjectiveCoefSelector */}
                            {/*     eventType={event_type} */}
                            {/*     subjectiveCoef={subjectiveCoef} */}
                            {/*     onChange={setSubjectiveCoef} */}
                            {/* /> */}
                        </View>
                    </View>
                </SafeAreaView>
            </Animated.View>
        </View>
    )
}
