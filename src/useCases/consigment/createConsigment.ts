import { useCollection } from "../../services/database"
import { Consignment } from "../../models/Consignment"

export async function createConsigment(consigment: Consignment) {
    const consigments = await useCollection<Consignment>("consignments")

    const doc = await consigments.save(consigment)
    return doc._key
}