import express from "express"
import { deductCredits, login, updateUserPayment } from "../controllers/auth.controller.js"
import { logOut } from "../controllers/auth.controller.js"

const router=express.Router()

router.post("/login",login)
router.get("/logout",logOut)
router.post("/update-plan",updateUserPayment)
router.post("/deduct-credit",deductCredits)

export default router
