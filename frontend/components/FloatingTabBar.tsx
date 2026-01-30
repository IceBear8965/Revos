import { useEffect, useRef, useState } from "react"
import { View, StyleSheet, LayoutChangeEvent } from "react-native"
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import { useTheme } from "@/context/ThemeContext"
import { TabBarButton } from "./TabBarButton"
import { useTabBar } from "@/context/TabBarContext"

export const FloatingTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const { colors } = useTheme()
    const { setBubbleReady } = useTabBar()

    const [layout, setLayout] = useState({ width: 0, height: 0 })

    const buttonCount = state.routes.length
    const buttonWidth = layout.width / buttonCount

    // Bubble position and opacity
    const bubbleX = useSharedValue(0)

    const onLayout = (e: LayoutChangeEvent) => {
        setLayout({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
        })
    }

    const bubbleWidth = Math.max(buttonWidth - 24, 0)
    const bubbleHeight = Math.max(layout.height - 16, 0)

    const getTranslateX = (index: number) => {
        return buttonWidth * index + buttonWidth / 2 - bubbleWidth / 2
    }

    useEffect(() => {
        if (layout.width === 0) return

        // Instantly place bubble under active tab
        bubbleX.value = getTranslateX(state.index)
        setBubbleReady()
    }, [layout.width])

    const animatedBubbleStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: bubbleX.value }],
    }))

    const styles = StyleSheet.create({
        tabBar: {
            position: "absolute",
            bottom: 30,
            marginHorizontal: 70,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.card,
            borderRadius: 35,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
        },
        bubble: {
            position: "absolute",
            left: 0,
            backgroundColor: colors.accentGreen,
            borderRadius: 30,
            width: bubbleWidth,
            height: bubbleHeight,
        },
    })

    return (
        <View onLayout={onLayout} style={styles.tabBar}>
            <Animated.View style={[styles.bubble, animatedBubbleStyle]} />

            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key]
                const label = options.tabBarLabel ?? options.title ?? route.name
                const isFocused = state.index === index

                const onPress = () => {
                    // Animate bubble to pressed tab
                    bubbleX.value = withSpring(getTranslateX(index), {
                        damping: 35,
                        stiffness: 150,
                    })

                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    })

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params)
                    }
                }

                return (
                    <TabBarButton
                        key={route.key}
                        onPress={onPress}
                        isFocused={isFocused}
                        routeName={route.name as any}
                        label={label as string}
                    />
                )
            })}
        </View>
    )
}
