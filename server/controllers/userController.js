import { UserModel } from "../models/UserModel.js";
import asyncHandler from "express-async-handler";
import { z } from "zod";
import jwt from "jsonwebtoken"

const userSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(4, "Password must be at least 4 characters").max(50, "Password cannot exceed 50 characters"),
    picture: z.string().optional(),
});

export const registerUser = asyncHandler(async (req, res) => {

    const validation = userSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ errors: validation });
    }

    const { username, email, password, picture } = validation.data;

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await UserModel.create({
        username,
        email,
        password,
        picture
    });

    const token = jwt.sign({user : user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    if (user) {
        res.status(201).json({
            message: "User Created Successfully",
            _id: user._id,
            username: user.username,
            email: user.email,
            token: token,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});


const signinSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(4, "Password must be at least 4 characters").max(50, "Password cannot exceed 50 characters"),
});

export const loginUser = asyncHandler(async (req, res) => {

    const validation = signinSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ errors: validation });
    }

    const { email, password } = validation.data;

    const user = await UserModel.findOne({ email });
    const isPasswordCorrect = await user.comparePassword(password);
    if (user && isPasswordCorrect) {
        const token = jwt.sign({ user :user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({
            message: "user login Successfully",
            _id: user._id,
            username: user.username,
            email: user.email,
            token: token,
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});


export const allUsers = asyncHandler(async (req, res) => {
    try {
        const filter = req.query.filter || "";
        const users = await UserModel.find({
            username: { "$regex": filter, "$options": "i" }
        });

        return res.status(200).json({
            users: users.map(user => ({
                username: user.username,
                picture: user.picture,
                _id: user._id
            }))
        });
    } catch (error) {
        res.status(500);
        throw new Error("Server Error: Unable to fetch allusers users");
    }
});


export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});