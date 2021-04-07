import { useDatabase } from "../../database"

export async function listUser() {
    const query = `
        FOR u IN users
            RETURN u
    `

    const database = useDatabase()
    const result = await database.query(query)

    return await result.all()
}