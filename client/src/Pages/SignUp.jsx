import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [socket, setSocket] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/register",
        {
          username,
          email,
          password,
        }
      );

      const { token, _id } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", _id);

      const newSocket = io("http://localhost:3000", {
        query: { _id },
      });
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (userId) => {
        console.log("Online users:", userId);
      });

      navigate("/dashboard", { state: { currentUser: username } });
    } catch (error) {
      console.error("Registration error:", error);
      alert("Error during registration. Please try again.");
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      socket.on("getOnlineUsers", (userId) => {
        console.log("Online users:", userId);
      });
    }
  }, [socket]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-700 via-purple-500 to-pink-500 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-white/20 to-transparent rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-3xl opacity-30 animate-pulse"></div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="relative bg-white text-gray-700 p-8 rounded-xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">
          Create Your Account
        </h2>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-lg transition duration-200"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
