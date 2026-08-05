import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectDb from "./config/db.js"
import router from "./routes/chat.routes.js"
dotenv.config()

const port=process.env.PORT

const app=express()
app.use(express.json())
app.use(cookieParser())
app.use("/",router)

app.get("/",(req,res)=>{
    res.json({message:"hello this is chat"})//me
})

app.listen(port,()=>{
    console.log("chat is running on", port)
    connectDb();
})