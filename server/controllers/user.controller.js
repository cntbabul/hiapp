import ErrorHandler from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateJWTToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";


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
    avatar: { public_id: "", url: "" },
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
      sameSite: "lax",
    })
    .json({
      success: true,
      message: "User logged out successfully",
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  })
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;
  // console.log(name, email);
  if (!name || !email || name.trim().length === 0 || email.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required",
    });
  }

  const data = { name, email };

  if (req.files && req.files.avatar && req.files.avatar.tempFilePath) {
    const avatar = req.files.avatar;
    try {
      const oldAvatarPublicId = req.user?.avatar?.public_id;
      if (oldAvatarPublicId && oldAvatarPublicId !== "") {
        await cloudinary.uploader.destroy(oldAvatarPublicId);
      }
      if (!avatar || !avatar.tempFilePath) {
        return res.status(400).json({
          success: false,
          message: "Avatar file is missing",
        });
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {
          folder: "hiapp_user_avatars",
          transformation: [
            { width: 200, height: 200, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        }
      );

      data.avatar = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    } catch (error) {
      console.error("Cloudinary upload error", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Cloudinary upload error",
      });
    }

  }

  const user = await User.findByIdAndUpdate(req.user._id, data, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});
