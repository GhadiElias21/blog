import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
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
    next(errorHandler(400, "Username already exists "));
  }

  if (Email) {
    next(errorHandler(400, "Email already exists "));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username, //username : username
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    res.json("Account created successfully");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      next(errorHandler(404, "invalid password or email"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(400, "invalid password or email"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { name,email, googlePhotoUrl } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._Id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        email + "ASDsda@sadwe1233" + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture:googlePhotoUrl
      });
      await newUser.save()
      const token= jwt.sign({id:newUser._id},process.env.JWT_SECRET)
      const {password,...rest}= newUser._doc;
      res.status(200).cookie('access_token',token,{
        httpOnly: true,
      }).json(rest)
    }
  } catch (error) {
    next(error);
  }
};
