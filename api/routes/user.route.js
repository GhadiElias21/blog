import e from "express";
import { test } from "../controllers/user.controller.js";

const router = e.Router();

router.get("/test",test)

export default router