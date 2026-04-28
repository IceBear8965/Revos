import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Alert, Pressable, StyleSheet, Text, View } from "react-native"
import BottomSheet, {
    BottomSheetView,
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet"
import { useTheme } from "@/context/ThemeContext"
import { TextInput } from "react-native-gesture-handler"
import { AppColors } from "@/theme/types"
import { ChangeTimezoneModalProps } from "./types"
import { useTimezone } from "./hooks/useTimezone"
import { Loader } from "@/shared/components/Loader"
import { Error } from "@/shared/components/Error"

export const ChangeTimezoneModal = ({
    modalVisible,
    setModalVisible,
    currentTimezone,
    onSuccess,
}: ChangeTimezoneModalProps) => {
    const [timezone, setTimezone] = useState<string | undefined>(currentTimezone)
    const { isLoading, error, refetch: changeTimezone } = useTimezone()
    const snapPoints = useMemo(() => ["30%"], [])
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                opacity={0.5}
            />
        ),
        []
    )

    const handleSave = async () => {
        if (timezone) {
            await changeTimezone(timezone)
            setModalVisible(false)
            onSuccess()
        } else {
            Alert.alert("Request failed", "Timezone can't be changed now.")
        }
    }

    useEffect(() => {
        if (modalVisible) {
            setTimezone(currentTimezone ?? "")
        }
    }, [modalVisible, currentTimezone])

    if (isLoading) return <Loader />
    if (error) return <Error error={error} />

    return (
        <BottomSheet
            index={modalVisible ? 0 : -1}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enablePanDownToClose
            onClose={() => setModalVisible(false)}
            backgroundStyle={{ backgroundColor: colors.background }}
            handleIndicatorStyle={{ backgroundColor: colors.textPrimary }}
            handleStyle={{
                backgroundColor: colors.foreground,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
            }}
        >
            <BottomSheetView style={{ padding: 20 }}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            value={timezone}
                            onChangeText={setTimezone}
                            style={styles.inputField}
                        />
                        <View style={{ flex: 1, alignItems: "center" }}>
                            <Pressable style={styles.createButton} onPress={handleSave}>
                                <Text style={styles.createButtonText}>Save</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </BottomSheetView>
        </BottomSheet>
    )
}

const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        modalContainer: {
            flex: 1,
            alignItems: "center",
        },
        modalContent: { width: "60%" },
        inputField: {
            textAlign: "left",
            color: colors.textPrimary,
            borderColor: colors.textPrimary,
            borderWidth: 2,
            borderRadius: 10,

            padding: 10,
            marginBottom: 15,
        },
        createButton: {
            paddingHorizontal: 30,
            paddingVertical: 15,
            borderRadius: 10,
            backgroundColor: colors.foreground,
        },
        createButtonText: {
            fontSize: 16,
            fontWeight: 600,
            color: colors.textPrimary,
        },
    })
}
