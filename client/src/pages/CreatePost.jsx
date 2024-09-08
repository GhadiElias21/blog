import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase";
import toast from "react-hot-toast";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate=useNavigate()
  const handleUploadImage = async () => {
    try {
      if (!file) {
        toast.error("Please select an image");
        return;
      }
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
        
          setImageUploadProgress(null);
          toast.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      toast.error(error);
      setImageUploadProgress(null);
    }
  };


const handleSubmit=async(e)=>{
  e.preventDefault();

  try {
    const res=await fetch('/api/post/create',{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    const data=await res.json()

  if(!res.ok){
    toast.error(data.message)
    return
  }

 
  if(res.ok){
navigate(`/post/${data.slug}`)
  }


  } catch (error) {
    toast.error('something went wrong')
    error
  }
  
}

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="title"
            required
            id="title"
            className="flex-1"
            onChange={(e)=>{

              setFormData({...formData,title:e.target.value})
            }}
          />
          <Select
            onChange={(e)=>{

              setFormData({...formData,category:e.target.value})
            }}>
            <option value="uncategorized">Select a category</option>
            <option value="videoGames">Video Games </option>
            <option value="sports">sports</option>
            <option value="life">life</option>
            <option value="politics">politics</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {formData.image && (
          <img
          src={formData.image}
          className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          required
          theme="snow"
          placeholder="write something"
          className="w-full h-[200px] sm:h-[250px] "
          onChange={
            (value)=>{
              setFormData({...formData,content:value})
            }
          }
        />
        <Button type="submit" className="mt-12" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  );
}

export default CreatePost;
