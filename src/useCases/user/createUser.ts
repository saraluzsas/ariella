import { useCollection } from "../../database"
import { User } from "../../models/User"

import admin from "firebase-admin"

export async function createUser(user: User) {
    const users = await useCollection<User>("users")
    const auth = admin.auth()

    const session = await auth.createUser({
        phoneNumber: user.phone,
        displayName: user.nickname,
    })

    await users.save({ _key: session.uid, ...user })
    return session.uid
}