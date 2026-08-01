import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import proxy from "express-http-proxy"
dotenv.config()

const port=process.env.PORT

const app=express()

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(cookieParser())
app.use("/auth",proxy(process.env.Auth_service))

app.get("/",(req,res)=>{
    res.json({message:"hello this is gateway"})
})

app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})