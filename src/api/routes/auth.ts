import { Router } from "express"
import { isAuth } from "../middlewares/auth"

export const authRouter = Router()

authRouter.get("/me", isAuth(), async function (req, res) {
    return res.send({ data: req["user"] })
})

authRouter.post("/me", isAuth(), async function (req, res) {
    
})