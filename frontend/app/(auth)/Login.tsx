import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { View, Text, TextInput, StyleSheet, Button } from "react-native"

export default function () {
    const { isAuth, signIn, signOut } = useAuth()
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const onLogin = () => {
        signIn(email, password)
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Login</Text>
            <TextInput onChangeText={setEmail} placeholder="Email" style={styles.input} />
            <TextInput onChangeText={setPassword} placeholder="Password" style={styles.input} />
            <Button title="Login" onPress={onLogin} />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        width: 240,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
})
