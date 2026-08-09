import dotenv from "dotenv"
import express from "express"
import cookieParser from "cookie-parser"
import connectDb from "./config/db.js"

dotenv.config()

import { router } from "./graph/router.js"

const port=process.env.PORT

const app=express()
app.use(express.json())
app.use(cookieParser())
app.use("/",router)

app.get("/",(req,res)=>{
    res.json({message:"hello this is agent"})//me
})

app.listen(port,()=>{
    console.log("server is running on", port)
    connectDb();
})