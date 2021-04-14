import { useCollection } from "../../services/database"

import admin from "firebase-admin"

export async function removeUser(id: string) {
    const users = await useCollection("users")
    const auth = admin.auth()

    await auth.deleteUser(id)
    await users.remove(id)
}