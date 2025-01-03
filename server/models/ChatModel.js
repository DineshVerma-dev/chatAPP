import mongoose from "mongoose";



const ChatSchema = mongoose.Schema({
    chatname: {
        type: String,
        trim: true,
    },
    isgroupchat: {
        type: boolean,
        default: false,
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel"
    }],
    latestmessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MessageModel"
    },
    groupadmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel"
    }
}, { timestamps: true })

const ChatModel = mongoose.model("ChatModel", ChatSchema);

export {ChatModel}