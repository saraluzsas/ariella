import { NextFunction, Request, Response } from "express"

import express from "express"
import cors from "cors"

import { json } from "body-parser"

import { userRouter } from "./api/users"
import { authRouter } from "./api/auth"
import { consignmentRouter } from "./api/consignments"

export function startServer(port: number) {
    const server = express()

    server.use(json({ limit: "20mb" }))
    server.use(cors())

    server.use("/user", userRouter)
    server.use("/auth", authRouter)
    server.use("/consignment", consignmentRouter)

    server.use("*", (req, res) => {
        return res
            .status(501)
            .send({
                message: "esta ruta no está disponible",
                error: true,
            })
    })

    server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        return res
            .status(500)
            .send({
                message: err.message,
                error: true,
            })
    })

    server.listen(port, function() {
        const now = new Date()
        const hour = now.toLocaleTimeString()

        console.log(`[${hour}] Ariella API on port ${port}`)
    })
}