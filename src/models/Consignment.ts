export interface ConsignmentDetail {
    date: string
    amount: number
}

export interface Consignment {
    photo: string
    author: string
    total: number
    draft: boolean
    note: string
    details: ConsignmentDetail[]

    createdAt: string
}