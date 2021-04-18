import { Router } from "express"
import { isAuth } from "../middlewares/auth"
import { findUserByPhone } from "../useCases/user/findUser"

export const authRouter = Router()

authRouter.get("/", isAuth(), async function (req, res) {
    return res.send({ data: req["user"] })
})

authRouter.get("/phone/:phone", async function (req, res, next) {
    try {
        const user = await findUserByPhone(req.params.phone)

        if (user) {
            return res.sendStatus(200)
        }

        else {
            return res
                .status(404)
                .send({
                    message: "usuario no encontrado",
                    error: true,
                })
        }
    }

    catch (err) {
        next(err)
    }
})

authRouter.post("/", isAuth(), async function (req, res) {
    
})