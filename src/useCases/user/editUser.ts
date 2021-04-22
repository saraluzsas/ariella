import { useCollection } from "../../services/database"
import { User } from "../../models/User"
import { findUser } from "./findUser"

import admin from "firebase-admin"

export async function editUser(id: string, data: User) {
    const users = await useCollection<User>("users")
    const auth = admin.auth()

    const old = await findUser(id)

    try {
        const session = await auth.getUserByPhoneNumber(old.phone)

        await auth.updateUser(session.uid, {
            displayName: data.nickname || old.nickname,
            phoneNumber: data.phone || old.phone
        })
    }

    catch (err) {
        console.error("usuario no se guardo en firebase")
    }

    finally {
        await users.update(id, data)
    }
}