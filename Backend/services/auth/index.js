import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
dotenv.config()

const port=process.env.PORT

const app=express()

app.get("/",(req,res)=>{
    res.json({message:"hello this is auth"})
})

app.listen(port,()=>{
    console.log("server is running on", port)
    connectDb();
})