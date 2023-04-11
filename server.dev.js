import express from 'express'
import dotenv from 'dotenv'
import { setRoutes } from './backend/routes/GRoute.js'
import cors from 'cors'
import session from 'express-session'

dotenv.config()
const server = express()
server.use(express.static('public'))
server.use('/assets', express.static('assets'))
server.use(express.json())
server.use(cors())
server.use(express.urlencoded({extended:true}))
server.set('view engine', 'ejs')
server.use(session({
    secret:'zAgUmEnNiKoVmArK18',
    saveUninitialized:false,
    resave:false,
    cookie:{
        secure:false,
        httpOnly:true,
        expires:true,
        maxAge:2*60*60*1000
    }
}))
setRoutes(server)

server.listen(process.env.SERVER_PORT, () => console.log("Server is sturted on: http://localhost:" + process.env.SERVER_PORT))