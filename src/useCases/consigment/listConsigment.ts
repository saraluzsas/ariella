import { useDatabase } from "../../database"

export async function listConsigment() {
    const query = `
        FOR c IN consignments
            SORT c.createdAt
            RETURN UNSET(c, "photo")
    `

    const database = useDatabase()
    const result = await database.query(query)

    return await result.all()
}