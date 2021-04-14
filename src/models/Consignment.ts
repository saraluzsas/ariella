export interface ConsignmentDetail {
    amount: string
    date: string
}

export interface Consignment {
    photo: string
    author: string
    total: number
    note: string
    details: ConsignmentDetail[]

    createdAt: string
    deletedAt?: string
}