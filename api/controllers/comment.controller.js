import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(errorHandler(403, "you are not allowed to comment"));
    }
    const newComment = new Comment({
      content: content,
      postId: postId,
      userId: userId,
    });
    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};
export const getLikers = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId).populate('likes', 'username profilePicture');
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }
  

    
    // Log the comment object to inspect the likes array
    console.log('Comment:', comment);

    // Check if likes array is populated correctly
    if (!comment.likes || comment.likes.length === 0) {
      return res.status(200).json([]);
    }

    const likers = comment.likes.map(user => {
      console.log('User:', user); // Log each user object
      return {
        username: user.username,
        profilePic: user.profilePic
      };
    });

    res.status(200).json(likers);
  } catch (error) {
    next(error);
  }
};
export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "comment not found"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(404, "you are not allowd to edit this comment"));
    }
    const editedComment= await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content:req.body.content
      },{
        new:true
      }
    )
    res.status(200).json(editedComment)
  } catch (error) {
    next(error);
  }

};

export const deleteComment=async(req,res,next)=>{
  try {
    const comment = await Comment.findById(req.params.commentId)

    if (!comment) {
      return next(errorHandler(404, "comment not found"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(404, "you are not allowd to delete this comment"));
    }
    await Comment.findByIdAndDelete(req.params.commentId)
    res.status(200).json(('comment has been deleted'))
  } catch (error) {
    next(error)
  }
}
export const getcomments = async (req, res, next) => {
  if (!req.user.isAdmin)
    return next(errorHandler(403, 'You are not allowed to get all comments'));
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'desc' ? -1 : 1;
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
};