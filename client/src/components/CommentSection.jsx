/* eslint-disable no-unused-vars */
import { Button, Modal, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

// eslint-disable-next-line react/prop-types
function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState("");
  const [showModal,setShowModal]=useState(false)
  const [commentToDelete,setCommentToDelete]=useState(null)
  console.log(comments);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (comment > 200) {
      return;
    }
    if (comment == 0) {
      toast.error("comments cannot be empty");
      return;
    }
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      setComments(data);
      if (res.ok) {
        setComment("");
        toast.success("comment has been posted");
        setComments([data, ...comments]);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        const data = await res.json();
        if (res.ok) {
          setComment("");
          setComments(data);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();

        console.log(data.likes);
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
try {
  if(!currentUser){
    navigate("/sign-in");
    return
  }
  const res= await fetch(`/api/comment/deletecomment/${commentId}`,{
    method: "DELETE",
  })
  if(res.ok){
    const data = await res.json();
 setComments(comments.filter((comment)=> comment._id !== commentId))
toast.success('message has been deleted')
 setShowModal(false)
  }
} catch (error) {
  toast.error(error.message)
}  };
  return (
    <div className="max-w-2xl mx-auto w-full mt-2 p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 text-gray-500 text-sm  ">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full "
            src={currentUser.profilePicture}
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className=" text-sm text-teal-500 mt-6 flex gap-1">
          you must be signed in to comment,
          <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
            Sign in
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border mt-[6px] border-teal-500 rounded-md p-3"
        >
          <Textarea
            onChange={(e) => setComment(e.target.value)}
            placeholder="add a comment"
            rows="3"
            maxLength="200"
            value={comment.content}
          />
          <div className="flex justify-between items-center mt-5 ">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">no Comments yet</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => {
            return (
              <Comment
                key={comment._id}
                comment={comment}
                onLike={handleLike}
                onEdit={handleEdit}
                onDelete={(commentId)=>{
                  setShowModal(true)
                  setCommentToDelete(commentId)
                }}
              />
            );
          })}
        </>
      )}
       <Modal
        className="
    "
        show={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14  w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className=" flex justify-center gap-4">
              <Button color="failure" onClick={()=>handleDelete(commentToDelete)}>
                Yes, i am sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CommentSection;
