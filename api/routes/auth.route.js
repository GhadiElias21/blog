import e from "express";
import { google, signup } from "../controllers/auth.controller.js";
import { signin } from "../controllers/auth.controller.js";

const router = e.Router()

router.post('/signup',signup)
router.post('/signin',signin)

router.post("/google", google)

export default router