import { Router } from "express"
import { useAuth } from "../middlewares/auth"
import { Roles } from "../models/User"
import { createUser } from "../useCases/user/createUser"
import { editUser } from "../useCases/user/editUser"
import { findUser } from "../useCases/user/findUser"
import { listUser } from "../useCases/user/listUser"

export const userRouter = Router()

userRouter.param("id", async function (req, res, next) {
    if (await findUser(req.params.id)) next()

    else {
        return res
            .status(404)
            .send({
                message: "no se encontró registro con ese id",
                error: true,
            })
    }
})

userRouter.use(useAuth(Roles.admin))

userRouter.post("/", async function (req, res, next) {
    const { nickname, role, phone } = req.body

    if (nickname && phone && role in Roles) {
        try {
            const user = {
                nickname,
                role, 
                phone,
                createdAt: new Date()
            }

            const id = await createUser(user)
            return res.send({
                message: "usuario registrado correctamente",
                data: { id }
            })
        }

        catch (err) {
            next(err)
        }
    }

    else {
        return res
            .status(400)
            .send({
                message: "faltan campos obligatorios",
                error: true,
            })
    }
})

userRouter.get("/", async function (req, res, next) {
    try {
        const users = await listUser()
        delete users[req["user"]._key]

        return res.send({ data: users })
    }

    catch (err) {
        next(err)
    }
})

userRouter.get("/:id", async function (req, res) {
    const user = await findUser(req.params.id)
    return res.send({ data: user })
})

userRouter.put("/:id", async function (req, res, next) {
    try {
        await editUser(req.params.id, req.body)
        return res
            .status(200)
            .send({ message: "usuario editado correctamente" })
    }

    catch (err) {
        next(err)
    }
})