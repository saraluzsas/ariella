import { useCollection } from "../../services/database"
import { Consignment } from "../../models/Consignment"

export async function findConsignment(id: string) {
    const consigments = await useCollection<Consignment>("consignments")

    if (await consigments.documentExists(id)) {
        return await consigments.document(id)
    }

    else {
        return undefined
    }
}