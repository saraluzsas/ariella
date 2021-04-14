import { Router } from "express"
import { isAuth, useAuth } from "../middlewares/auth"
import { Consignment } from "../models/Consignment"
import { Roles } from "../models/User"
import { createConsigment } from "../useCases/consigment/createConsigment"
import { findConsignment } from "../useCases/consigment/findConsignment"
import { listConsigmentPerAuthor } from "../useCases/consigment/listConsigment"
import { queryConsignment } from "../useCases/consigment/queryConsignment"

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

consignmentRouter.post("/", useAuth(Roles.store), async function (req, res, next) {
    try {
        const author = req["user"]._key
        const id = await createConsigment({ ...req.body, author, createdAt: new Date() })

        return res.send({
            data: { id },
            message: "consignación registrada",
        })
    }

    catch (err) {
        next(err)
    }
})

consignmentRouter.get("/", useAuth(Roles.admin), async function (req, res, next) {
    try {
        const result = await queryConsignment(req.query)

        return res.send({ data: result })
    }

    catch (err) {
        next(err)
    }
})

consignmentRouter.get("/:id", useAuth(Roles.admin, Roles.store), async function (req, res, next) {
    try {
        const consignment = req["consignment"] as Consignment
        delete consignment.photo

        return res.send({ data: consignment })
    }

    catch (err) {
        next(err)
    }
})

consignmentRouter.get("/:id/photo", useAuth(Roles.admin, Roles.store), async function (req, res, next) {
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

consignmentRouter.get("/author/:author", isAuth(), async function (req, res, next) {
    try {
        const author = req.params.author.toString()
        const consignments = await listConsigmentPerAuthor(author)

        return res.send({ data: consignments })
    }

    catch (err) {
        next(err)
    }
})