import { Router } from "express"
import { createConsigment } from "../useCases/consigment/createConsigment"
import { listConsigment } from "../useCases/consigment/listConsigment"

export const consigmnetRouter = Router()

consigmnetRouter.post("/", async function (req, res, next) {
    try {
        const id = await createConsigment({ ...req.body, createdAt: new Date() })
        return res.send({ data: { id } })
    }

    catch (err) {
        next(err)
    }
})

consigmnetRouter.get("/", async function (req, res, next) {
    const consigments = await listConsigment()
    return res.send({ data: consigments })
})