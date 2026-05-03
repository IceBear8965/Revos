import { SetStateAction, Dispatch, ReactNode } from "react"

export interface BottomSheetProps {
    children: ReactNode
    visible: boolean
    setVisible: Dispatch<SetStateAction<boolean>>
    height?: number
}
