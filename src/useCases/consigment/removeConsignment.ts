import { Consignment } from "../../models/Consignment"
import { useCollection } from "../../services/database"

export async function removeConsignment(id: string) {
    const consignments = await useCollection<Consignment>("consignments")
    await consignments.remove(id)
}