import express from "express"
import { login } from "../controllers/auth.controller.js"
import { logOut } from "../controllers/auth.controller.js"

const router=express.Router()

router.post("/login",login)
router.get("/logout",logOut)

export default router
