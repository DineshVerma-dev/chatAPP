
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
        unique : true
    },
    password : {
        type : String,
        required  :true,
    },
    picture : {
        type  :String,
        default :"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
},{timestamps : true})

const UserModel = mongoose.model("UserModel" ,UserSchema);

export {UserModel}