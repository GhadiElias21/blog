import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://th.bing.com/th/id/R.62325205054ee42cbd441c7036a7e3ec?rik=RHdJrVUP%2b%2b8klA&pid=ImgRaw&r=0",
    },
    isAdmin:{
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
