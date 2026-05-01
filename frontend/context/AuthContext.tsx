import { createContext, useState, useEffect, PropsWithChildren, useContext } from "react"
import { authApi } from "@/api/auth/api"
import { tokenStore } from "@/utils/TokenStore"
import { httpClient } from "@/api/http/HttpClient"

interface AuthContextType {
    isAuth: boolean
    isLoading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used within AuthProvider")
    return ctx
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [isAuth, setIsAuth] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Initialise Auth
    useEffect(() => {
        const init = async () => {
            const isRestored = await authApi.restoreSession()

            if (isRestored) {
                setIsAuth(true)
            } else {
                await signOut()
            }

            setIsLoading(false)
        }

        init()
    }, [])

    const signIn = async (email: string, password: string) => {
        try {
            await authApi.login(email, password)
            setIsAuth(true)
        } catch (error) {
            console.log(error)
        }
    }

    const signOut = async () => {
        try {
            httpClient.clearQueue()
            tokenStore.clearTokens()
            setIsAuth(false)
        } catch {
            console.log("Can't sign out")
        }
    }

    return (
        <AuthContext.Provider value={{ isAuth, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}
