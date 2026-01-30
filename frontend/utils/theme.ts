import * as SecureStore from "expo-secure-store"

const THEME_KEY = "app_colorscheme"

export const loadTheme = async (): Promise<string | null> => {
    try {
        return await SecureStore.getItemAsync(THEME_KEY)
    } catch (e) {
        console.log("Error reading saved theme value: ", e)
        return null
    }
}

export const saveTheme = async (theme: string) => {
    try {
        await SecureStore.setItemAsync(THEME_KEY, theme)
    } catch (e) {
        console.log("Error saving theme value: ", e)
    }
}
