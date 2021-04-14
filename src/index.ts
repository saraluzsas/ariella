import { createServer } from "./server"

// env

import dotenv from "dotenv"
dotenv.config()

// firebase

import "./services/firebase"

// server

const server = createServer()

server.listen(process.env.PORT || 5000, function () {
    console.log("Server running")
})