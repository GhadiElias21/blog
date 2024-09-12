import e from "express";
import { deleteUser, signout, updateUser,getUsers, getUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = e.Router();

router.put('/update/:userId',verifyToken, updateUser)

router.delete("/delete/:userId",verifyToken,deleteUser)

router.post('/signout',signout)

router.get('/getusers',verifyToken,getUsers)

router.get('/:userId',getUser)

export default router