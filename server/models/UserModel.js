
import mongoose from "mongoose";
import bcrypt from 'bcrypt';


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
},{timestamps : true});


UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        console.log("error in comparepassword", error)
    }
}

const UserModel = mongoose.model("UserModel" ,UserSchema);

export { UserModel }