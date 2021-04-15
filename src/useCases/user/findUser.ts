import { useCollection, useDatabase } from "../../services/database"
import { User } from "../../models/User"

import admin from "firebase-admin"
import { Document } from "arangojs/documents"

export async function findUser(id: string) {
    const users = await useCollection<User>("users")

    return await users.documentExists(id)
        ? await users.document(id)
        : undefined
}

export async function findUserByPhone(phone: string) {
    const query = `
        FOR u IN users
            FILTER u.phone == @phone
            LIMIT 1

            RETURN u
    `

    const database = useDatabase()
    const result = await database.query(query, { phone })

    return await result.next() as Document<User>
}

export async function findUserByFirebaseId(id: string) {
    const auth = admin.auth()
    const session = await auth.getUser(id)

    return await findUserByPhone(session.phoneNumber)
}