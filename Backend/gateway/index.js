import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import proxy from "express-http-proxy"
import { getCurrentUser } from "./controllers/user.controller.js"
import protect from "./middleware/auth.middleware.js"
import { proxyWithHeader } from "./utils/proxyWithHeader.js"
import morgan from "morgan"
dotenv.config()

const port=process.env.PORT

const app=express()

app.use(express.json())
app.use(morgan("dev"))
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(cookieParser())
app.use("/api/chat", protect, proxyWithHeader(process.env.Chat_service))
app.use("/api/agent", protect, proxy(process.env.Agent_service, {
    proxyReqPathResolver: (req) => {
        const path = req.originalUrl || req.url || "/";
        return path.replace(/^\/api\/agent/, "") || "/";
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers = proxyReqOpts.headers || {};

        if (srcReq.user) {
            proxyReqOpts.headers["x-user-id"] = srcReq.user.userID || srcReq.user.userId || srcReq.user._id;
        }

        return proxyReqOpts;
    }
}))
app.use("/api/auth",proxy(process.env.Auth_service, {
    proxyReqPathResolver: req => req.url,
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