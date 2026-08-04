import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import proxy from "express-http-proxy"
import { getCurrentUser } from "./controllers/user.controller.js"
import protect from "./middleware/auth.middleware.js"
dotenv.config()

const port=process.env.PORT

const app=express()

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(cookieParser())
app.use("/api/auth",proxy(process.env.Auth_service, {
    proxyReqPathResolver: req => req.originalUrl,
    userResHeaderDecorator: (headers, userReq, userRes, proxyReq, proxyRes) => {
        const setCookie = proxyRes.headers['set-cookie']
        if (setCookie) {
            headers['set-cookie'] = setCookie
        }
        return headers
    }
}))

app.get("/api/me",protect,getCurrentUser)

app.get("/",(req,res)=>{
    res.json({message:"hello this is gateway"})
})

app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})