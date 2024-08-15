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
    profilePicture:{
      type:String,
      default:"https://4.bp.blogspot.com/-nhvgISgeQ9I/V8YnrPgqYxI/AAAAAAAA7OQ/O3z8vcqKVJQm7N-_ZGtDbKdy4Z_sJxm6ACLcB/s1600/blank-profile-picture-973461_1280.png"
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User",userSchema)

export default User