import express from "express";
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
        return res.status(400).json({ errors: validation.error.errors });
    }

    const { username, email, password , picture} = validation.data;

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
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "1h" });
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

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
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