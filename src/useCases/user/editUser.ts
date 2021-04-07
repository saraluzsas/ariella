import { useCollection } from "../../database"
import { User } from "../../models/User"

export async function editUser(id: string, data: User) {
    const users = await useCollection<User>("users")
    await users.update(id, data)
}