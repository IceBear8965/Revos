import { createContext, useState, useEffect, PropsWithChildren, useContext } from "react"
import { httpClient } from "@/api/HttpClient"
import { tokenStore } from "@/utils/TokenStore"

interface AuthContextType {
    isAuth: boolean
    isLoading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    authenticateFromTokens: () => Promise<void>
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
            try {
                const accessToken = await httpClient.refreshAccess()
                if (accessToken) {
                    setIsAuth(true)
                } else {
                    await signOut()
                }
            } catch {
                await signOut()
            } finally {
                setIsLoading(false)
            }
        }
        init()
    }, [])

    // ----- signIn / signOut -----
    const signIn = async (email: string, password: string) => {
        try {
            const data = await httpClient.login(email, password)
            if (data) {
                setIsAuth(true)
            }
        } catch (error) {
            console.log(`HTTP ${error}`)
        }
    }

    const signOut = async () => {
        try {
            tokenStore.clearTokens()
            setIsAuth(false)
        } catch (error) {
            console.log("Can't sign out")
        }
    }

    const authenticateFromTokens = async () => {
        const access = tokenStore.getAccess()
        if (access) {
            setIsAuth(true)
        }
    }

    return (
        <AuthContext.Provider
            value={{ isAuth, isLoading, signIn, signOut, authenticateFromTokens }}
        >
            {children}
        </AuthContext.Provider>
    )
}
