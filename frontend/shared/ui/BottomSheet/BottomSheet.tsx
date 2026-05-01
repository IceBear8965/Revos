import { useEffect, useRef } from "react"
import { Pressable, View, Animated, PanResponder, Dimensions } from "react-native"

import { useTheme } from "@/context/ThemeContext"
import { useTabBar } from "@/context/TabBarContext"
import { BottomSheetProps } from "./types"

const SCREEN_HEIGHT = Dimensions.get("window").height

export const BottomSheet = ({ children, visible, setVisible, height = 0.4 }: BottomSheetProps) => {
    const { colors } = useTheme()
    const { setVisible: setTabBarVisible } = useTabBar()

    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current
    const isOpen = useRef(false)

    const animateTo = (toValue: number, callback?: () => void) => {
        Animated.timing(translateY, {
            toValue,
            duration: 250,
            useNativeDriver: true,
        }).start(callback)
    }

    const open = () => {
        setTabBarVisible(false)
        isOpen.current = true
        animateTo(0)
    }

    const close = () => {
        animateTo(SCREEN_HEIGHT, () => {
            isOpen.current = false
            setTabBarVisible(true)
            setVisible(false)
        })
    }

    useEffect(() => {
        if (visible) {
            open()
        } else {
            close()
        }
    }, [visible])

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => g.dy > 10,

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

    if (!visible && !isOpen.current) return null

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
            {/* backdrop */}
            <Pressable
                onPress={close}
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                }}
            />

            {/* sheet */}
            <Animated.View
                style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    height: SCREEN_HEIGHT * height,
                    backgroundColor: colors.background,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    transform: [{ translateY }],
                }}
            >
                <View style={{ flex: 1 }}>
                    {/* handle */}
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

                    {/* content */}
                    <View style={{ flex: 1 }}>{children}</View>
                </View>
            </Animated.View>
        </View>
    )
}
