export enum Roles {
    admin = "admin",
    store = "store"
}

export interface User {
    nickname: string
    phone: string
    role: Roles
    createdAt: Date
}