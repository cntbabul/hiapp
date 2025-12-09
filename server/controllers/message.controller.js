import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js";
import User from "../models/user.model.js";
import { Message as MessageChannel } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../utils/socket.js";
import { v2 as cloudinary } from "cloudinary";

export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    const filteredUser = await User.find({ _id: { $ne: user._id } }).select("-password");
    res.status(200).json({
        success: true,
        message: "Fetched all users (placeholder)",
        users: filteredUser
    });
});

export const getMessages = catchAsyncError(async (req, res, next) => {
    const receiverId = req.params.id;
    const myId = req.user._id;
    const receiver = await User.findById(receiverId);
    if (!receiver) {
        return res.status(404).json({
            success: false,
            message: "Receiver not found",
        });
    }

    const messages = await MessageChannel.find({
        $or: [
            { senderId: myId, receiverId: receiverId },
            { senderId: receiverId, receiverId: myId },
        ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
        success: true,
        message: "Fetched messages successfully",
        messages,
    });
});
export const sendMessages = catchAsyncError(async (req, res, next) => {
    const { text } = req.body;
    const media = req.files?.media;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
        return res.status(404).json({
            success: false,
            message: "Receiver not found",
        });
    }
    const sanitizedText = (text || "").trim();
    if (!sanitizedText && !media) {
        return res.status(400).json({
            success: false,
            message: "Can not send empty message",
        });
    }

    let mediaUrl = "";
    try {
        if (media) {
            const uploadResponse = await cloudinary.uploader.upload(
                media.tempFilePath, {
                resource_type: "auto",
                folder: "CHAT_APP_MEDIA",
                transformation: [
                    {
                        width: 1080,
                        height: 1080,
                        crop: "limit"
                    },
                    { quality: "auto" },
                    { fetch_format: "auto" },
                ]
            }
            )
            mediaUrl = uploadResponse?.secure_url;
        }
    } catch (error) {
        console.error("Cloudinary upload error", error);
        return res.status(500).json({
            success: false,
            message: "Cloudinary media upload error",
        });
    }

    const newMessage = await MessageChannel.create({
        senderId,
        receiverId,
        text: sanitizedText,
        media: mediaUrl,
    })

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json({ newMessage, })

});