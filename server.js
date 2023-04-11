import express from 'express'
import dotenv from 'dotenv'
import { setRoutes } from './backend/routes/GRoute.js'
import cors from 'cors'
import session from 'express-session'
import RedisStore from 'connect-redis'
import { Redis } from 'ioredis'

dotenv.config()
const server = express()
export const redisClient=new Redis({port:6379,host:"redis"})
server.use(express.static('public'))
server.use('/assets', express.static('assets'))
server.use(express.json())
server.use(cors())
server.use(express.urlencoded({extended:true}))
server.set('view engine', 'ejs')
server.use(session({
    store:new RedisStore({client:redisClient}),
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