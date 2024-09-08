import e from "express";
import { deleteUser, signout, updateUser,getUsers } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = e.Router();

router.put('/update/:userId',verifyToken, updateUser)

router.delete("/delete/:userId",verifyToken,deleteUser)

router.post('/signout',signout)

router.get('/getusers',verifyToken,getUsers)


export default router