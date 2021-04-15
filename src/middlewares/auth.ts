import { NextFunction, Request, Response } from "express"
import { findUserByFirebaseId } from "../useCases/user/findUser"

import admin from "firebase-admin"

async function extractUserFromHeader(header: string) {
    const auth = admin.auth()

    const regex = /[Bb]earer (?<token>.*)/i
    const token = header.match(regex).groups["token"]
    
    const payload = await auth.verifyIdToken(token, true)

    return await findUserByFirebaseId(payload.uid)
}

export function isAuth() {
    return async function (req: Request, res: Response, next: NextFunction) {
        const authorization = req.headers["authorization"]

        if (authorization) {
            try {
                const user = await extractUserFromHeader(authorization)

                if (user) {
                    req["user"] = user
                    return next()
                }

                else {
                    return res
                        .status(404)
                        .send({
                            message: "el usuario no fue encontrado",
                            error: true
                        })
                }
            }
    
            catch (err) {
                console.error(err)
    
                return res
                    .status(500)
                    .send({
                        message: "algo fallo al decodificar el token",
                        error: true
                    })
            }
        }

        return res
            .status(401)
            .send({ 
                message: "se necesita credenciales para acceder a esta ruta",
                error: true
            })
    }
}

export function useAuth(...roles: string[]) {
    return async function (req: Request, res: Response, next: NextFunction) {
        const authorization = req.headers["authorization"]

        if (authorization) {
            try {
                const user = await extractUserFromHeader(authorization)

                if (roles.includes(user.role)) {
                    req["user"] = user
                    return next()
                }

                else {
                    return res
                        .status(401)
                        .send({
                            message: "no tienes los permiso para estar aquí",
                            error: true,
                        })
                }
            }
    
            catch (err) {
                console.error(err)
    
                return res
                    .status(500)
                    .send({
                        message: "algo fallo al decodificar el token",
                        error: true
                    })
            }
        }

        return res
            .status(401)
            .send({
                message: "se necesita credenciales para acceder a esta ruta",
                error: true,
            })
    }
}