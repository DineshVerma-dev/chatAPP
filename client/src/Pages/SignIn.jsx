import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/login",
        {
          email,
          password,
        }
      );

      const { token, _id, username } = response.data;

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
      console.error("Login error:", error);
      alert("Invalid credentials or server error.");
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-700 text-white">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-white/20 to-transparent rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-3xl opacity-30 animate-pulse"></div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="relative bg-white text-gray-700 p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Welcome Back
        </h2>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-200"
        >
          Sign In
        </button>
        <div className="mt-4 text-center text-sm">
          <p>Don't have an account?</p>
          <Link
            to="/signup"
            className="text-blue-500 hover:text-blue-600 font-semibold underline"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;

