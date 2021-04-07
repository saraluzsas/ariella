export enum Roles {
    developer = "developer",
    auditor = "auditor",
    store = "store"
}

export interface User {
    nickname: string
    phone: string
    role: Roles
    createdAt: Date
}