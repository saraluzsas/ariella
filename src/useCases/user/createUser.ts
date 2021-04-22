import { useCollection } from "../../services/database"
import { User } from "../../models/User"

export async function createUser(user: User) {
    const users = await useCollection<User>("users")

    const doc = await users.save(user)

    return doc._key
}