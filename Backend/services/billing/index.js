import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectDb from "./config/db.js"
dotenv.config()

const port=process.env.PORT

const app=express()
app.use(express.json())

app.get("/",(req,res)=>{
    res.json({message:"hello this is billing"})//me
})

app.listen(port,()=>{
    console.log("server is running on", port)
    connectDb();
})