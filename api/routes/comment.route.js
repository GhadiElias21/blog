import e from "express";
import { createComment, deleteComment, editComment, getcomments, getLikers, getPostComments, likeComment } from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router=e.Router()

router.post('/create',verifyToken,createComment)
router.get('/getPostComments/:postId',getPostComments)
router.put('/likecomment/:commentId',verifyToken,likeComment)
router.put('/editcomment/:commentId',verifyToken,editComment)
router.delete('/deletecomment/:commentId',verifyToken,deleteComment)
router.get('/getcomments', verifyToken, getcomments);

export default router;