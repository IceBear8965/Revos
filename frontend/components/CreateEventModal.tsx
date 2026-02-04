import { Modal, View, Text, Pressable, StyleSheet, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import AntDesign from "@expo/vector-icons/AntDesign"
import { useTheme } from "@/context/ThemeContext"
import { AppColors } from "@/theme/colors"
import { LOAD_ACTIVITIES, RECOVERY_ACTIVITIES } from "@/utils/constants"

interface CreateEventModalType {
    event_type: "load" | "recovery"
    modalVisible: boolean
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export const CreateEventModal = ({
    event_type,
    modalVisible,
    setModalVisible,
}: CreateEventModalType) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)

    const chooseValues = event_type === "load" ? LOAD_ACTIVITIES : RECOVERY_ACTIVITIES

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false)
            }}
        >
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalTop}>
                        <Pressable
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <AntDesign name="close" size={30} color={colors.textPrimary} />
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    )
}

const createStyles = (colors: AppColors) => {
    return StyleSheet.create({
        modalContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
        },
        modalContent: {
            width: "80%",
            backgroundColor: colors.foreground,
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },

        modalTop: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        closeButton: {
            alignSelf: "flex-end",
        },
    })
}
