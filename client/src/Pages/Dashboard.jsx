import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Users from "../Components/Users";

const Dashboard = () => {
 
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const socket = io("http://localhost:3000"); // Replace with your backend URL

  useEffect(() => {
    // Connect to the backend
    socket.on("connect", () => {
      console.log("Connected to server");

      // Fetch the current logged-in user's details
      socket.emit("joint-chat");
      socket.on("currentUser", (user) => {
        setCurrentUser(user.username); // Set the current user's name
      });

      // Fetch the list of all users
      socket.emit("getUsers");
      socket.on("usersList", (userList) => {
        setUsers(userList);
        setFilteredUsers(userList); // Initialize filtered users list
      });

      // Listen for incoming messages
      socket.on("receiveMessage", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  


 

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-600 p-4">
        <h1 className="text-2xl font-bold text-orange-400 mb-4">Chat App</h1>


        <Users />

      </div>

      {/* Chat Section */}
      <div className="w-2/3 p-4 flex flex-col">
       
        

        {/* Chat Box */}
        <div className="flex-1 border border-gray-600 rounded p-4 space-y-4 overflow-y-auto">
          {messages.map((chat, index) => (
            <div
              key={index}
              className={`border border-gray-600 rounded p-2 ${chat.from === "Me" ? "text-green-400" : "text-gray-300"
                }`}
            >
              {chat.from}: {chat.text}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="mt-4 flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Input to send"
            className="flex-1 p-2 border rounded bg-gray-800 text-white"
          />
          <button
            
            className="ml-2 bg-purple-500 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

