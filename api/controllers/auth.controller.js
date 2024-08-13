import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
export const signup = async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required LIL BRO"));
  }

  if (password !== confirmPassword) {
    next(errorHandler(400, "passwords dont match man WAKE UP"));
  }

  const user = await User.findOne({ username });
  const Email = await User.findOne({ email });
  if (user) {
    next(errorHandler(400, "Username already exists ya 8abe"));
  }

  if (Email) {
    next(errorHandler(400, "Email already exists ya 7mar"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username, //username : username
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    res.json("W signup");
  } catch (error) {
    next(error);
  }
};
