import * as SecureStore from "expo-secure-store"

class TokenStore {
    private REFRESH_KEY = "refresh_key"
    private accessToken: string | null = null

    // Access token handling
    getAccess = (): string | null => {
        return this.accessToken
    }
    setAccess = (newAccess: string) => {
        this.accessToken = newAccess
    }
    deleteAccess = () => {
        this.accessToken = null
    }

    // Refresh token handling
    getRefresh = async (): Promise<string | null> => {
        try {
            return await SecureStore.getItemAsync(this.REFRESH_KEY)
        } catch (e) {
            console.error("Error reading refresh token", e)
            return null
        }
    }
    setRefresh = async (refresh: string): Promise<void> => {
        try {
            await SecureStore.setItemAsync(this.REFRESH_KEY, refresh)
        } catch (e) {
            console.error("Error saving refresh token", e)
        }
    }

    deleteRefresh = async (): Promise<void> => {
        try {
            await SecureStore.deleteItemAsync(this.REFRESH_KEY)
        } catch (e) {
            console.error("Error deleting refresh token", e)
        }
    }

    clearTokens = async () => {
        this.deleteAccess()
        this.deleteRefresh()
    }
}

export const tokenStore = new TokenStore()
