import mongoose, { mongo } from "mongoose";


const MessageSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
    },
    content: {
        type: String,
        trim: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatModel",
    },

}, { timestamps: true });

const MessageModel = mongoose.model("MessageModel" , MessageSchema);

export {MessageModel}