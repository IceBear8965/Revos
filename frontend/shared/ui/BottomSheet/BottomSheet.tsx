import { useEffect, useRef, useCallback } from "react"
import {
    Pressable,
    View,
    Animated,
    PanResponder,
    Dimensions,
    Keyboard,
    Platform,
    KeyboardAvoidingView,
} from "react-native"

import { useTheme } from "@/context/ThemeContext"
import { useTabBar } from "@/context/TabBarContext"
import { BottomSheetProps } from "./types"

const SCREEN_HEIGHT = Dimensions.get("window").height

export const BottomSheet = ({ children, visible, setVisible, height = 0.4 }: BottomSheetProps) => {
    const { colors } = useTheme()
    const { setVisible: setTabBarVisible } = useTabBar()

    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current
    const keyboardOffset = useRef(new Animated.Value(0)).current

    const isAnimating = useRef(false)

    const totalTranslateY = Animated.add(translateY, Animated.multiply(keyboardOffset, -1))

    const open = useCallback(() => {
        setTabBarVisible(false)
        isAnimating.current = true

        Animated.timing(translateY, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            isAnimating.current = false
        })
    }, [])

    const close = useCallback(() => {
        isAnimating.current = true

        Keyboard.dismiss()

        Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            isAnimating.current = false
            setTabBarVisible(true)
            setVisible(false)
        })
    }, [])

    useEffect(() => {
        if (visible) open()
        else if (!isAnimating.current) close()
    }, [visible])

    useEffect(() => {
        const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow"

        const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide"

        const showSub = Keyboard.addListener(showEvent, (e) => {
            Animated.timing(keyboardOffset, {
                toValue: e.endCoordinates.height,
                duration: 250,
                useNativeDriver: true,
            }).start()
        })

        const hideSub = Keyboard.addListener(hideEvent, () => {
            Animated.timing(keyboardOffset, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start()
        })

        return () => {
            showSub.remove()
            hideSub.remove()
        }
    }, [])

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => g.dy > 8,

            onPanResponderMove: (_, g) => {
                if (g.dy > 0) {
                    translateY.setValue(g.dy)
                }
            },

            onPanResponderRelease: (_, g) => {
                if (g.dy > 120) {
                    close()
                } else {
                    open()
                }
            },
        })
    ).current

    if (!visible) return null

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
            {/* BACKDROP */}
            <Pressable
                onPress={close}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 1,
                }}
            />

            {/* SHEET */}
            <Animated.View
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,

                    height: SCREEN_HEIGHT * height,
                    backgroundColor: colors.background,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,

                    transform: [{ translateY: totalTranslateY }],

                    zIndex: 2,
                }}
            >
                {/* HANDLE */}
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

                {/* CONTENT */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={{ flex: 1 }}
                >
                    {children}
                </KeyboardAvoidingView>
            </Animated.View>
        </View>
    )
}
