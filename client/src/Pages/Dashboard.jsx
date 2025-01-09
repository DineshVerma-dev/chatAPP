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
      query: { currentuserId },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server via socket:", newSocket.id);
      newSocket.emit("registerUser", { userId: currentuserId });
    });

    newSocket.on("newMessage", (data) => {
      console.log("New message received via socket:", data.content);

      setMessages((prevMessages) => [...prevMessages, data]);

      // Track unread messages for the sender
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
    if (!message.trim() || !selectedUser) return;

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

      console.log("Message sent successfully:", data.content);

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

    // Mark messages as read for the selected user
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
      {/* Sidebar for Users */}
      <div className="w-1/3 border-r border-gray-700 p-4">
        <h1 className="text-2xl font-bold text-orange-400 mb-4">Chat App</h1>
        <Users
          setSelectedUser={handleUserClick}
          unreadMessages={unreadMessages}
        />
      </div>

      {/* Chat Area */}
      <div className="w-2/3 p-4 flex flex-col">
        {selectedUser ? (
          <h2 className="text-xl font-bold mb-4">
            Chat with {selectedUser.username}
          </h2>
        ) : (
          <h2 className="text-xl font-bold mb-4">Select a user to chat</h2>
        )}

        {/* Messages */}
        <div className="flex-1 border border-gray-700 rounded bg-gray-800 p-4 space-y-4 overflow-y-auto">
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
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    chat.senderId === currentUser
                      ? "bg-green-500 text-white"
                      : "bg-gray-700 text-white"
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
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded bg-gray-700 text-white"
            disabled={!selectedUser}
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-purple-600 text-white px-4 py-2 rounded"
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
