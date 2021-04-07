import { useCollection } from "../../database"
import { User } from "../../models/User"

export async function findUser(id: string) {
    const users = await useCollection<User>("users")

    return await users.documentExists(id)
        ? await users.document(id)
        : undefined
}