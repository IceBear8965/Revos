import { PropsWithChildren, createContext, useState, useEffect, useContext } from "react"

interface TabBarContextType {
    isTabBarReady: boolean
    isVisible: boolean
    setBubbleReady: () => void
    setIconReady: () => void
    setVisible: (visible: boolean) => void
}

export const TabBarContext = createContext<TabBarContextType>({
    isTabBarReady: false,
    isVisible: true,
    setBubbleReady: () => {},
    setIconReady: () => {},
    setVisible: (visible: boolean) => {},
})

export const useTabBar = () => {
    const value = useContext(TabBarContext)
    if (!value) {
        throw new Error("useTabBar must be wrapped in a <TabBarProvider />")
    }
    return value
}

export const TabBarProvider = ({ children }: PropsWithChildren) => {
    const [isTabBarReady, setIsTabBarReady] = useState<boolean>(false)
    const [isBubbleReady, setIsBubbleReady] = useState<boolean>(false)
    const [isIconReady, setIsIconReady] = useState<boolean>(false)

    const [isVisible, setIsVisible] = useState<boolean>(true)

    useEffect(() => {
        if (isBubbleReady && isIconReady) {
            setIsTabBarReady(true)
        }
    }, [isBubbleReady, isIconReady])

    const setBubbleReady = () => {
        setIsBubbleReady(true)
    }
    const setIconReady = () => setIsIconReady(true)

    const setVisible = (visible: boolean) => {
        setIsVisible(visible)
    }

    return (
        <TabBarContext
            value={{
                isTabBarReady: isTabBarReady,
                isVisible: isVisible,
                setBubbleReady: setBubbleReady,
                setIconReady: setIconReady,
                setVisible: setVisible,
            }}
        >
            {children}
        </TabBarContext>
    )
}
