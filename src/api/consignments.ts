import { Router } from "express"
import { Consignment } from "../models/Consignment"
import { createConsigment } from "../useCases/consigment/createConsigment"
import { findConsignment } from "../useCases/consigment/findConsignment"
import { listConsigment } from "../useCases/consigment/listConsigment"

export const consignmentRouter = Router()

consignmentRouter.param("id", async function (req, res, next) {
    try {
        const id = req.params.id.toString()
        const consignment = await findConsignment(id)
        
        if (consignment) {
            req["consignment"] = consignment
            next()
        }

        else {
            return res
                .status(404)
                .send({
                    message: "consignación no encontrada" + id,
                    error: true,
                })
        }
    }

    catch (err) {
        return res
            .status(500)
            .send({
                message: err.message,
                error: true,
            })
    }
})

consignmentRouter.post("/", async function (req, res, next) {
    try {
        const id = await createConsigment({ ...req.body, createdAt: new Date() })
        return res.send({ data: { id } })
    }

    catch (err) {
        next(err)
    }
})

consignmentRouter.get("/", async function (req, res, next) {
    try {
        const consigments = await listConsigment()
        return res.send({ data: consigments })
    }

    catch (err) {
        next(err)
    }
})

consignmentRouter.get("/:id", async function (req, res, next) {
    try {
        const consignment = req["consignment"] as Consignment
        delete consignment.photo

        return res.send({ data: consignment })
    }

    catch (err) {
        next(err)
    }
})

consignmentRouter.get("/:id/photo", async function (req, res, next) {
    try {
        const consignment = req["consignment"] as Consignment

        const data = consignment.photo.match(/data:(?<type>.*);base64,(?<content>.*)/)
        const type = data.groups.type
        const buffer = Buffer.from(data.groups.content, "base64")

        res.writeHead(200, {
            "content-type": type,
            "content-length": buffer.length
        })

        res.end(buffer)
    }

    catch (err) {
        next(err)
    }
})