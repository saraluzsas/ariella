import { createServer } from "./server"

// env

import dotenv from "dotenv"
dotenv.config()

// firebase

import "./services/firebase"

// server

export default createServer()