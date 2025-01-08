import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Users from "../Components/Users";

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(""); // Logged-in user
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for chat
  const [message, setMessage] = useState(""); // Message input
  const [messages, setMessages] = useState([]); // Chat messages
  const [socket, setSocket] = useState(null); // Socket instance

  // Initialize Socket.IO connection
  useEffect(() => {
    const currentuserId = localStorage.getItem("userId")
    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
      query: {currentuserId}, // Pass current user ID to the server
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server via socket:", newSocket.id);
    });

    newSocket.on("newMessage", (data) => {
      console.log("New message received via socket:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser]);

  

  // Send message to the server
  const sendMessage = async () => {
    if (!message.trim() || !selectedUser) return;
     console.log(`selecteduser ${selectedUser.username} : selectuserid ${selectedUser._id}`)
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/message/send",
        {
          content: message,
          receiverId: selectedUser._id,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      console.log("Message sent successfully:", data);

      // Emit the message via socket for real-time updates
      socket.emit("sendMessage", data);

      // Update the local message state
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...data, senderId: "Me" },
      ]);

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <div className="w-1/3 border-r border-gray-600 p-4">
        <h1 className="text-2xl font-bold text-orange-400 mb-4">Chat App</h1>
        <Users setSelectedUser={setSelectedUser} />
      </div>

      <div className="w-2/3 p-4 flex flex-col">
        {selectedUser ? (
          <h2 className="text-xl font-bold mb-4">Chat with {selectedUser.username}</h2>
        ) : (
          <h2 className="text-xl font-bold mb-4">Select a user to chat</h2>
        )}

        <div className="flex-1 border border-gray-600 rounded text-yellow-50 p-4 space-y-4 overflow-y-auto">
          {messages
            .filter(
              (chat) =>
                (chat.senderId === selectedUser && chat.receiverId === currentUser) ||
                (chat.senderId === currentUser && chat.receiverId === selectedUser)
            )
            .map((chat, index) => (
              <div
                key={index}
                className={`border border-gray-600 rounded p-2 ${
                  chat.senderId === "Me" ? "text-green-400" : "text-gray-300"
                }`}
              >
                {chat.senderId === "Me" ? "Me" : chat.senderId}: {chat.content}
              </div>
            ))}
        </div>

        <div className="mt-4 flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded bg-gray-800 text-white"
            disabled={!selectedUser}
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-purple-500 text-white px-4 py-2 rounded"
            disabled={!selectedUser}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
