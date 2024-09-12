/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";
import toast from "react-hot-toast";
function Comment({ comment, onLike, onEdit,onDelete }) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
  }, [comment]);


  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };
  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success('comment has been updated')
        console.log("data", data);

        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="flex p-4  border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img src={user.profilePicture} className="rounded-full h-10 w-10" />
      </div>

      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate ">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              onChange={(e) => setEditedContent(e.target.value)}
              className="mb-2"
              maxLength="200"
              value={editedContent}
            />
            <div className="flex gap-2 justify-end text-xs">
              <Button
                type="button"
                onClick={handleSave}
                size="sm"
                gradientDuoTone="purpleToBlue"
              >
                Save
              </Button>
              <Button
                outline
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="dark:text-blue-300 text-gray-700 pb-2">
              {comment.content}
            </p>

            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId ) && (
                  <>
                  <button
                    onClick={handleEdit}
                    className="text-gray-400 hover:text-red-500 "
                    type="button"
                  >
                    Edit
                  </button>
                       <button
                       onClick={()=>onDelete(comment._id)}
                       className="text-gray-400 hover:text-red-500 "
                       type="button"
                     >
                     Delete
                     </button>
                     </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Comment;
