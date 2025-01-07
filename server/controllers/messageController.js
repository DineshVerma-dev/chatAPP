import asyncHandler from "express-async-handler";
import { MessageModel } from "../models/MessageModel.js";
import { ChatModel } from "../models/ChatModel.js";
import { io, getReceiverSocketId } from "../utils/socket.js";


export const allMessages = asyncHandler(async (req, res) => {
    const messages = await MessageModel.find({ chat: req.params.chatId })
        .populate("sender", "username picture email")
        .populate("chat");

    res.json(messages);
});

export const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    // Validate input
    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.status(400).json({ message: "Content and chatId are required" });
    }

    const newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        const createdMessage = await MessageModel.create(newMessage);

        const message = await MessageModel.findById(createdMessage._id)
            .populate("sender", "username picture")
            .populate({
                path: "chat",
                populate: { path: "users", select: "username picture email" },
            });

        await ChatModel.findByIdAndUpdate(chatId, { latestmessage: message });

        const receiverSocketId = getReceiverSocketId(chatId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", message);
        }

        res.status(200).json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


