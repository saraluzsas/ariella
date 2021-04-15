import { useCollection } from "../../services/database"
import { User } from "../../models/User"

import admin from "firebase-admin"

export async function createUser(user: User) {
    const users = await useCollection<User>("users")
    const auth = admin.auth()

    await users.save(user)

    const session = await auth.createUser({
        phoneNumber: user.phone,
        displayName: user.nickname
    })

    return session.uid
}