import { startServer } from "./server"

// env

import dotenv from "dotenv"

if (process.env.NODE_ENV !== "production") {
    dotenv.config()
}

// firebase

import admin from "firebase-admin"

admin.initializeApp({
    credential: admin.credential.cert(require("../firebase.keys.json"))
})

// server

startServer(5000)