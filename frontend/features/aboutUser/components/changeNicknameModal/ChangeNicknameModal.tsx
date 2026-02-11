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
import { ChangeNicknameModalProps } from "./types"
import { useNickname } from "./hooks/useNickname"
import { Loader } from "@/shared/components/Loader"
import { Error } from "@/shared/components/Error"

export const ChangeNicknameModal = ({
    modalVisible,
    setModalVisible,
    currentNickname,
    onSuccess,
}: ChangeNicknameModalProps) => {
    const [nickname, setNickname] = useState<string | undefined>(currentNickname)
    const { isLoading, error, refetch: changeNickname } = useNickname()
    const sheetRef = useRef<BottomSheet>(null)
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

    const closeModal = () => setModalVisible(false)

    const handleSave = async () => {
        if (nickname) {
            await changeNickname(nickname)
            onSuccess()
        } else {
            Alert.alert("Request failed", "Nickname can't be changed now.")
        }
    }

    useEffect(() => {
        if (!sheetRef.current) return
        if (modalVisible) sheetRef.current.expand()
        else sheetRef.current.close()
    }, [modalVisible])

    if (isLoading) return <Loader />
    if (error) return <Error error={error} />

    return (
        <BottomSheet
            ref={sheetRef}
            index={-1}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enablePanDownToClose
            onClose={closeModal}
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
                            value={nickname}
                            onChangeText={setNickname}
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
