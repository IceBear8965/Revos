import { useTheme } from "@/context/ThemeContext"
import React from "react"
import { View, Text, Pressable } from "react-native"
import { useWindowDimensions } from "react-native"

interface CredentialsStepProps {
    nextStep: () => void
}

export const CredentialsStep = ({ nextStep }: CredentialsStepProps) => {
    const { colors } = useTheme()
    const { width } = useWindowDimensions()

    return (
        <View style={{ width, justifyContent: "center", alignItems: "center" }}>
            <Text>Credentials</Text>
            <Pressable onPress={nextStep}>
                <Text>Next</Text>
            </Pressable>
        </View>
    )
}
