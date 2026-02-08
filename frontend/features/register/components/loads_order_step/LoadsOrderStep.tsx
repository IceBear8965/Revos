import { useTheme } from "@/context/ThemeContext"
import React from "react"
import { View, Text, Pressable } from "react-native"
import { useWindowDimensions } from "react-native"

interface LoadsOrderStepProps {
    prevStep: () => void
    nextStep: () => void
}

export const LoadsOrderStep = ({ prevStep, nextStep }: LoadsOrderStepProps) => {
    const { colors } = useTheme()
    const { width } = useWindowDimensions()

    return (
        <View style={{ width, justifyContent: "center", alignItems: "center" }}>
            <Text>Loads order</Text>
            <Pressable onPress={prevStep}>
                <Text>Prev</Text>
            </Pressable>
            <Pressable onPress={nextStep}>
                <Text>Next</Text>
            </Pressable>
        </View>
    )
}
