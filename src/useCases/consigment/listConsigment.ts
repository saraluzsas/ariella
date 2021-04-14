import { useDatabase } from "../../services/database"

export async function listConsigment() {
    try {
        const query = `
            FOR c IN consignments
                SORT c.createdAt
                RETURN UNSET(c, "photo")
        `

        const database = useDatabase()
        const result = await database.query(query)

        return await result.all()
    }

    catch (err) {
        return []
    }
}

export async function listConsigmentPerAuthor(author: string) {
    try {
        const query = `
            FOR c IN consignments
                SORT c.createdAt
                FILTER c.author == @author

                RETURN UNSET(c, "photo")
        `

        const database = useDatabase()
        const result = await database.query(query, { author })

        return await result.all()
    }

    catch (err) {
        return []
    }
}