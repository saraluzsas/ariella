import { useCollection } from "../../services/database"
import { User } from "../../models/User"

import admin from "firebase-admin"
import { findUser } from "./findUser"

export async function editUser(id: string, data: User) {
    const users = await useCollection<User>("users")
    const auth = admin.auth()

    const old = await findUser(id)
    const session = await auth.getUserByPhoneNumber(old.phone)

    await auth.updateUser(session.uid, {
        displayName: data.nickname || old.nickname,
        phoneNumber: data.phone || old.phone
    })

    await users.update(id, data)
}