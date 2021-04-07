import { startServer } from "./server"

// env

import dotenv from "dotenv"

if (process.env.NODE_ENV !== "production") {
    dotenv.config()
}

// firebase

import "./firebase"

// server

startServer(5000)