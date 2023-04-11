import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()
const pool=new pg.Pool({
    host:process.env.HOST_DATABASE,
    port:process.env.PORT_DATABASE,
    database:process.env.NAME_DATABASE,
    user:process.env.USER_DATABASE,
    password:process.env.PASSWORD_DATABASE
})

export const sendRequest=async(req,params)=>{
    try{
        const client=await pool.connect()
        const data=await client.query(req,params)
        client.release()
        return data?data.rows:null 
    }catch(err){
        console.log(err.stack)
    }
}