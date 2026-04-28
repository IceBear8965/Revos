import { SetStateAction } from "react"

interface CreateTypeModalProps {
    modalVisible: boolean
    setModalVisible: React.Dispatch<SetStateAction<boolean>>
}

interface CreateTypeProps {
    name: string
    category: "load" | "recovery"
    value: number
}

export { CreateTypeModalProps, CreateTypeProps }
