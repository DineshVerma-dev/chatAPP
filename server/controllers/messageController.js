import asyncHandler from "express-async-handler";
import { MessageModel } from "../models/MessageModel.js";
import { io, getReceiverSocketId } from "../utils/socket.js";



export const allMessages = asyncHandler(async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await MessageModel.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });
        if(!messages){
            res.json({messages : "not found any message"})
        }
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

export const sendMessage = asyncHandler(async (req, res) => {
    try {
        const senderId = req.user._id;
        const { content } = req.body;
        const { receiverId } = req.body;


        const newMessage = new MessageModel({
            senderId,
            receiverId,
            content,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        console.log("receiverid ", receiverSocketId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});
