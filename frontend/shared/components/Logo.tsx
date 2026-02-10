import { Image } from "react-native"

export const Logo = () => {
    return (
        <Image
            style={{ width: 200, height: 200 }}
            source={require("@/assets/images/logo-no-bg.png")}
        />
    )
}
