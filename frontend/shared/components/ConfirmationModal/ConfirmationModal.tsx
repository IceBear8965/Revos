import { useEffect, useRef, useState } from "react"
import { Pressable, Text, View, Animated, PanResponder, Dimensions } from "react-native"
import Entypo from "@expo/vector-icons/Entypo"
import { useTheme } from "@/context/ThemeContext"
import { useTabBar } from "@/context/TabBarContext"
import { Loader } from "@/shared/components/Loader"
import { ConfirmationModalProps } from "./types"
import { createStyles } from "./styles"

const SCREEN_HEIGHT = Dimensions.get("window").height

export const ConfirmationModal = ({
    title,
    onConfirm,
    onDeny,
    modalVisible,
    setModalVisible,
}: ConfirmationModalProps) => {
    const { colors } = useTheme()
    const styles = createStyles(colors)
    const { setVisible } = useTabBar()

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
                justifyContent: "center",
                alignItems: "center",
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
                    width: "80%",
                    height: SCREEN_HEIGHT * 0.17,
                    backgroundColor: colors.background,
                    borderRadius: 20,
                    padding: 20,
                    transform: [{ translateY }],
                }}
            >
                <View style={{ flex: 1, alignItems: "center" }}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <Pressable onPress={() => close()}>
                            <Entypo name="cross" size={24} color={colors.textPrimary} />
                        </Pressable>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <Pressable style={styles.denyButton} onPress={onDeny}>
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: 500,
                                    color: colors.textPrimary,
                                }}
                            >
                                Deny
                            </Text>
                        </Pressable>
                        <Pressable style={styles.confirmButton} onPress={onConfirm}>
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: 500,
                                    color: colors.textPrimary,
                                }}
                            >
                                Confirm
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Animated.View>
        </View>
    )
}
