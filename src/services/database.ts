import { Database } from "arangojs"

export function useDatabase() {
    return new Database({
        url: process.env.ARANGO_URL,
        databaseName: process.env.ARANGO_DATABASE,
        auth: {
            username: process.env.ARANGO_USER,
            password: process.env.ARANGO_PASSWORD
        }
    })
}

export async function useCollection<T extends object = any>(name: string) {
    const database = useDatabase()
    const collection = database.collection<T>(name)

    if (await collection.exists()) return collection

    else {
        await collection.create()
        return collection
    }
}