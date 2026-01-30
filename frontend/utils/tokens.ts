import * as SecureStore from "expo-secure-store"

const REFRESH_KEY = "refresh_key"

export const getRefresh = async (): Promise<string | null> => {
    try {
        return await SecureStore.getItemAsync(REFRESH_KEY)
    } catch (e) {
        console.error("Error reading refresh token", e)
        return null
    }
}

export const setRefresh = async (refresh: string): Promise<void> => {
    try {
        await SecureStore.setItemAsync(REFRESH_KEY, refresh)
    } catch (e) {
        console.error("Error saving refresh token", e)
    }
}

export const deleteRefresh = async (): Promise<void> => {
    try {
        await SecureStore.deleteItemAsync(REFRESH_KEY)
    } catch (e) {
        console.error("Error deleting refresh token", e)
    }
}
