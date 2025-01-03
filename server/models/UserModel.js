
import mongoose from "mongoose";


const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
    },
    password : {
        type : String,
        required  :true,
    }
},{timestamps : true})

const UserModel = mongoose.model("UserModel" ,UserSchema);

export {UserModel}