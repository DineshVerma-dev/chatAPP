import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(""); // Stores the logged-in user's name
  const [searchTerm, setSearchTerm] = useState(""); // Stores the search query
  const [filteredUsers, setFilteredUsers] = useState([]); // Stores the filtered list of users
  const [users, setUsers] = useState([]); // Stores all users
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const socket = io("http://localhost:3000"); // Replace with your backend URL

  useEffect(() => {
    // Connect to the backend
    socket.on("connect", () => {
      console.log("Connected to server");

      // Fetch the current logged-in user's details
      socket.emit("getCurrentUser");
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

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = () => {
    if (selectedUser && message.trim()) {
      const newMessage = { to: selectedUser, text: message };
      socket.emit("sendMessage", newMessage);
      setMessages((prev) => [...prev, { from: "Me", text: message }]);
      setMessage("");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = users.filter((user) =>
      user.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-600 p-4">
        <h1 className="text-2xl font-bold text-orange-400 mb-4">Chat App</h1>
        <p className="text-purple-400 mb-4">Welcome, {currentUser || "Loading..."}</p>
        <h2 className="text-lg font-semibold text-purple-400 mb-2">
          Search Users
        </h2>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search for users..."
          className="w-full p-2 mb-4 border rounded bg-gray-800 text-white"
        />
        <div className="space-y-2">
          {filteredUsers.map((user, index) => (
            <div
              key={index}
              className={`flex items-center p-2 border rounded ${
                selectedUser === user ? "border-purple-400" : "border-gray-600"
              } cursor-pointer`}
              onClick={() => handleUserSelect(user)}
            >
              <div className="w-4 h-4 rounded-full bg-gray-600 mr-2"></div>
              <span>{user}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="w-2/3 p-4 flex flex-col">
        {/* Selected User */}
        <div className="mb-4">
          {selectedUser ? (
            <h2 className="text-lg font-semibold">
              Chat with <span className="text-purple-400">{selectedUser}</span>
            </h2>
          ) : (
            <h2 className="text-lg font-semibold">Select a user to start chat</h2>
          )}
        </div>

        {/* Chat Box */}
        <div className="flex-1 border border-gray-600 rounded p-4 space-y-4 overflow-y-auto">
          {messages.map((chat, index) => (
            <div
              key={index}
              className={`border border-gray-600 rounded p-2 ${
                chat.from === "Me" ? "text-green-400" : "text-gray-300"
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
            onClick={handleSendMessage}
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

