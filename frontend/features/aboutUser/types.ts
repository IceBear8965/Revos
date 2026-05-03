interface AboutUserResponseType {
    userId: number
    email: string
    nickname: string
    timezone: string
}

interface DeleteTypePayload {
    id: number
}

export { AboutUserResponseType, DeleteTypePayload }
