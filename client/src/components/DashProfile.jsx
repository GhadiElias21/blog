/* eslint-disable no-unused-vars */
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateFailure,
  updateSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutSuccess
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { HiOutlineExclamationCircle } from "react-icons/hi";
const DashProfile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(null);
  const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const filePickerRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileURL(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadingError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadingError(
          "could not upload image (File must be less than 2mb)"
        );
        setImageFileUploadingProgress(null);
        setImageFile(null);
        setImageFileURL(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileURL(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-undef
    if (Object.keys(formData).length === 0) {
      toast.error("No changes made");
      return;
    }

    if (imageFileUploading) {
      toast.error("Please wait for image to upload ");
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        toast.error(data.message);
      } else {
        dispatch(updateSuccess(data));
        toast.success("User's profile updated successully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      toast.error(error.message);
    }
  }


  const handleDeleteUser=async ()=>{
setShowModal(false)

try {
  dispatch(deleteUserStart)
  const res=await fetch(`/api/user/delete/${currentUser._id}`,{
    method:"DELETE",
  })
  const data =await res.json()
  if(!res.ok){
    toast.error(data.message)
    dispatch(deleteUserFailure(data.message))
  }
else{
  toast.success('Account deleted')
  dispatch(deleteUserSuccess(data))
}
} catch (error) {
  toast.error(error.message)
  dispatch(deleteUserFailure(error.message))
}
  }



  const handleSignOut=async ()=>{
    try {
      const res=await fetch ("api/user/signout",{
        method:"POST",
      })
      const data=await res.json()

      if(!res.ok){
        toast.error(data.message)
      }else{
        dispatch(signoutSuccess())
        toast.success("User signed out")
      }
    } catch(error) {
     toast.error(error)
    }
  }
  return (
    <div className="max-w-lg mx-auto w-full p-3">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
          ref={filePickerRef}
        />

        <div
          className=" relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => {
            filePickerRef.current.click();
          }}
        >
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={imageFileUploadingProgress || 0}
              text={`
          ${imageFileUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(5, 255, 115,${
                    imageFileUploadingProgress / 100
                  }`,
                },
                text: {
                  // Text color
                  fill: `rgba(5, 255, 115,${imageFileUploadingProgress / 200}`,
                  // Text size
                  fontSize: "16px",
                },
                background: {
                  fill: "#3e98c7",
                },
              }}
            />
          )}

          <img
            src={imageFileURL || currentUser.profilePicture}
            alt="user"
            className={`object-cover rounded-full w-full h-full ${
              imageFileUploadingProgress &&
              imageFileUploadingProgress < 100 &&
              "opacity-60"
            } `}
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />

        {imageFileUploadingError && toast.error(imageFileUploadingError)}
        <TextInput type="password" id="password" placeholder="password" />
        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
          outline
          onChange={handleChange}
        >
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5 ">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="cursor-pointer">Sign out</span>
      </div>
      <Modal className="
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
             
              Are you sure you want to delete your account
            </h3>
            <div className=" flex justify-center gap-4">
<Button color='failure' onClick={handleDeleteUser}>Yes, i am sure</Button>
<Button color='gray' onClick={()=>setShowModal(false)}>No, cancel</Button>

            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
