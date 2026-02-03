import { createContext, useState, useEffect, useRef, PropsWithChildren, useContext } from "react"

import { apiClient } from "@/api/axios"
import { signInRequest, refreshRequest } from "@/api/auth"
import { getRefresh, setRefresh, deleteRefresh } from "@/utils/tokens"

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
    const accessTokenRef = useRef<string | null>(null)
    const [isAuth, setIsAuth] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const saveAccess = (token: string | null) => {
        accessTokenRef.current = token
    }

    // Initialise Auth
    useEffect(() => {
        const init = async () => {
            try {
                const refresh = await getRefresh()
                if (!refresh) {
                    setIsAuth(false)
                    return
                }

                const newAccess = await refreshRequest(refresh)
                saveAccess(newAccess)
                setIsAuth(true)
            } catch {
                await signOut()
            } finally {
                setIsLoading(false)
            }
        }
        init()
    }, [])

    // Interceptors
    useEffect(() => {
        const reqInterceptor = apiClient.interceptors.request.use((config) => {
            const token = accessTokenRef.current
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`
            }
            return config
        })

        const resInterceptor = apiClient.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest: any = error.config

                if (!error.response || error.response.status !== 401) {
                    return Promise.reject(error)
                }

                try {
                    const refresh = await getRefresh()
                    if (!refresh) throw new Error("No refresh token")

                    const newAccess = await refreshRequest(refresh)
                    saveAccess(newAccess)

                    originalRequest.headers["Authorization"] = `Bearer ${newAccess}`
                    const resp = await apiClient(originalRequest)
                    const data = resp.data ?? JSON.parse(resp.request?._response ?? resp._response)
                    console.log(data)
                    return data
                } catch (err) {
                    await signOut()
                    return Promise.reject(err)
                }
            }
        )

        return () => {
            apiClient.interceptors.request.eject(reqInterceptor)
            apiClient.interceptors.response.eject(resInterceptor)
        }
    }, [])

    // ----- signIn / signOut -----
    const signIn = async (email: string, password: string) => {
        setIsLoading(true)
        try {
            const data = await signInRequest(email, password)
            saveAccess(data.access)
            await setRefresh(data.refresh)
            setIsAuth(true)
        } finally {
            setIsLoading(false)
        }
    }

    const signOut = async () => {
        saveAccess(null)
        await deleteRefresh()
        setIsAuth(false)
    }

    return (
        <AuthContext.Provider value={{ isAuth, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}
