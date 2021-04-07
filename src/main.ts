import { startServer } from "./server"

// env

import dotenv from "dotenv"
dotenv.config()

// firebase

import "./firebase"

// server

startServer(5000)