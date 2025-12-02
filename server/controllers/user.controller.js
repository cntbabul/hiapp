import ErrorHandler from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateJWTToken } from "../utils/jwtToken.js";

export const signup = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  if (!name || !email || !password) {
    return res.status(400).json({
      status: "false",
      message: "All fields are required",
    });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: "false",
      message: "Enter valid email",
    });
  }
  if (password.length < 8) {
    return res.status(400).json({
      status: "false",
      message: "Password must be at least 8 characters long",
    });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      status: "false",
      message: "User already exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    avatar: { public_id: "default_avatar", url: "default_avatar_url" },
  });

  generateJWTToken(user, "User registered successfully", 201, res);
});

export const signin = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: "false",
      message: "All fields are required",
    });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: "false",
      message: "Enter valid email",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      status: "false",
      message: "User not found",
    });
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return res.status(400).json({
      status: "false",
      message: "Incorrect password",
    });
  }
  generateJWTToken(user, "User logged in successfully", 200, res);
});

export const signout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development" ? true : false,
      sameSite: "strict",
    })
    .json({
      success: true,
      message: "User logged out successfully",
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {});

export const updateProfile = catchAsyncError(async (req, res, next) => {});
