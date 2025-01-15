import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Users from "../Components/Users";

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const currentuserId = localStorage.getItem("userId");

    if (!currentuserId) {
      console.error("User ID not found in localStorage");
      return;
    }

    setCurrentUser(currentuserId);

    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
      query: { userId: currentuserId },
    });

    setSocket(newSocket);

    newSocket.emit("registerUser", { userId: currentuserId });

    newSocket.on("newMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);

      setUnreadMessages((prevUnread) => ({
        ...prevUnread,
        [data.senderId]: (prevUnread[data.senderId] || 0) + 1,
      }));
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
        console.log("Socket disconnected in dashboard");
      }
    };
  }, []);

  const sendMessage = async () => {
    if (!message.trim() || !selectedUser || selectedUser._id === currentUser) {
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/message/send",
        {
          content: message,
          receiverId: selectedUser._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      socket.emit("sendMessage", data.content);

      setMessages((prevMessages) => [
        ...prevMessages,
        { ...data, senderId: currentUser },
      ]);

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);

    setUnreadMessages((prevUnread) => {
      const updatedUnread = { ...prevUnread };
      delete updatedUnread[user._id];
      return updatedUnread;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-700 p-6 bg-gray-800">
        <h1 className="text-3xl font-extrabold text-orange-400 mb-6">Chat App</h1>
        <Users
          setSelectedUser={handleUserClick}
          unreadMessages={unreadMessages}
        />
      </div>

      {/* Chat Area */}
      <div className="w-2/3 flex flex-col p-6">
        {/* Header */}
        <div className="mb-6">
          {selectedUser ? (
            <h2 className="text-2xl font-bold text-blue-400">
              Chat with {selectedUser.username}
            </h2>
          ) : (
            <h2 className="text-2xl font-bold text-gray-400">
              Select a user to start chatting
            </h2>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-gray-700 p-4 rounded-lg shadow-lg space-y-4">
          {messages
            .filter(
              (chat) =>
                (chat.senderId === selectedUser?._id &&
                  chat.receiverId === currentUser) ||
                (chat.senderId === currentUser &&
                  chat.receiverId === selectedUser?._id)
            )
            .map((chat, index) => (
              <div
                key={index}
                className={`flex ${
                  chat.senderId === currentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-md px-4 py-2 rounded-lg ${
                    chat.senderId === currentUser
                      ? "bg-purple-600 text-white"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {chat.content}
                </div>
              </div>
            ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input Area */}
        <div className="mt-4 flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-500 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            disabled={!selectedUser || selectedUser._id === currentUser}
          />
          <button
            onClick={sendMessage}
            className="ml-4 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg shadow-lg transition"
            disabled={!selectedUser || selectedUser._id === currentUser}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;




