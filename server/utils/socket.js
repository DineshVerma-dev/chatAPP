import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type","Authorization"],
        credentials: true
    },
});


export function getReceiverSocketId(userId) {
    console.log("Looking for userId in userSocketMap:", userId);
    console.log("Current userSocketMap:", userSocketMap);
    return userSocketMap[userId];
}

const userSocketMap = {};
io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // const userId = socket.handshake.query._id;
    
    socket.on("registerUser", ({ userId }) => {
        console.log("User ID registered:", userId);
        console.log("server not geeting id from the client ", userId)
        if (userId) {
            userSocketMap[userId] = socket.id
            console.log("Updated userSocketMap:", userSocketMap);
        };

        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        socket.on("disconnect", () => {
            console.log("A user disconnected", socket.id);
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });

    });







});


export { io, app, server };
