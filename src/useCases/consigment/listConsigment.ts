import { useDatabase } from "../../database"

export async function listConsigment() {
    const query = `
        FOR c IN consigments
            SORT c.createdAt
            RETURN c
    `

    const database = useDatabase()
    const result = await database.query(query)

    return await result.all()
}