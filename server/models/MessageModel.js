import mongoose from "mongoose";


const MessageSchema = mongoose.Schema({
  
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
       
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
    },
    content: {
        type: String,
    },



}, { timestamps: true });

const MessageModel = mongoose.model("MessageModel", MessageSchema);

export { MessageModel }