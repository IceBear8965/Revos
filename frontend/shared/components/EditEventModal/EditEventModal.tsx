import { useEffect, useRef, useState } from "react"
import { Pressable, Text, View, Animated, PanResponder, Dimensions } from "react-native"
import { useTheme } from "@/context/ThemeContext"
import { ActivitiTypePicker } from "../selectors/ActivityTypePicker/ActivityTypePicker"
import { ModalTimePicker } from "../selectors/ModalTimePicker/ModalTimePicker"
import { SubjectiveCoefSelector } from "../selectors/SubjectiveCoefSelector/SubjectiveCoefSelector"
import { createStyles } from "./styles"
import { Alert } from "react-native"
import { useTabBar } from "@/context/TabBarContext"
import { useActivityTypes } from "@/context/ActivityTypesContext"
import { ActivityTypeDTO } from "@/api/types"
import { Loader } from "@/shared/components/Loader"
import { EditEventModalType } from "./types"
import { useEditEvent } from "@/shared/hooks/useEditEvent"
import { Error } from "../Error"

const SCREEN_HEIGHT = Dimensions.get("window").height

export const EditEventModal = ({
    refetch,
    event,
    modalVisible,
    setModalVisible,
}: EditEventModalType) => {
    const { colors } = useTheme()
    const { setVisible } = useTabBar()
    const { types, isLoading: isTypesLoading } = useActivityTypes()
    const { data: response, isLoading, error: editingError, refetch: editEvent } = useEditEvent()
    const styles = createStyles(colors)

    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current
    const [isOpen, setIsOpen] = useState(false)

    // Event type picker
    const [dropDownValues, setDropDownValues] = useState<ActivityTypeDTO[] | null>(null)
    const [isDropDownOpen, setIsDropDownOpen] = useState(false)
    const [dropDownValue, setDropDownValue] = useState<number | null>(null)

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
            setIsDropDownOpen(false)
        })
    }

    useEffect(() => {
        if (modalVisible) open()
        else close()
    }, [modalVisible])

    useEffect(() => {
        console.log(event)
        setDropDownValue(event.id)
        setStartedAt(event.startedAt)
        setEndedAt(event.endedAt)
        setSubjectiveCoef(event.subjectiveCoef)
    }, [modalVisible])

    // Update values dependent on selected event_type
    useEffect(() => {
        const values = types.filter((el) => el.category === event.eventType)
        setDropDownValues(values)
    }, [modalVisible, event])

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

    const handleEditEvent = async () => {
        if (!dropDownValue) return

        try {
            await editEvent({
                id: event.id,
                activity: dropDownValue,
                startedAt: startedAt,
                endedAt: endedAt,
                subjeciveCoef: subjectiveCoef,
            })
            await refetch()
            close()
        } catch (error) {
            console.log(error)
            Alert.alert("Error", "Failed to create event")
        }
    }

    if (!isOpen) return null
    if (isLoading) return <Loader message="Saving your activity" />
    if (isTypesLoading) return <Loader message="Loading your activities" />

    if (editingError) return <Error error={editingError} />

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
                        <Text style={styles.headerTitle}>New Event</Text>

                        <Pressable onPress={handleEditEvent} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </Pressable>
                    </View>

                    {/* CONTENT */}
                    <View style={styles.modalContentContainer}>
                        <View style={styles.modalContent}>
                            <ActivitiTypePicker
                                dropDownValues={dropDownValues}
                                isDropDownOpen={isDropDownOpen}
                                dropDownValue={dropDownValue}
                                setIsDropDownOpen={setIsDropDownOpen}
                                setDropDownValue={setDropDownValue}
                            />
                            <ModalTimePicker
                                startedAt={startedAt}
                                endedAt={endedAt}
                                setStartedAt={setStartedAt}
                                setEndedAt={setEndedAt}
                                resetSignal={resetSignal}
                            />
                            <SubjectiveCoefSelector
                                eventType={event.eventType}
                                subjectiveCoef={subjectiveCoef}
                                onChange={setSubjectiveCoef}
                            />
                        </View>
                    </View>
                </View>
            </Animated.View>
        </View>
    )
}
