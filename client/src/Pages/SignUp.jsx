// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from "react-router-dom"
// import { io } from 'socket.io-client';

// const SignUp = () => {
//   const socket = io("http://localhost:3000")
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const navigate = useNavigate();
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:3000/api/v1/user/register', {
//         username,
//         email,
//         password,
//       });
//       localStorage.setItem("token", response.data.token);
//       console.log(response.data);
//       socket.connect();
//       navigate("/dashboard")
//     } catch (error) {
//       console.error('There was an error!', error);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-black">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
//         <div className="mb-4">
//           <label className="block text-gray-700">Username:</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="mt-1 p-2 w-full border rounded"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="mt-1 p-2 w-full border rounded"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="mt-1 p-2 w-full border rounded"
//           />
//         </div>
//         <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Sign Up</button>
//       </form>
//     </div>
//   );
// };

// export default SignUp;



import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [socket, setSocket] = useState(null); // State to manage the socket instance

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/v1/user/register', {
        username,
        email,
        password,
      });

      // Extract userId and token from the response
      const {  token , _id } = response.data;

      // Store the token and userId in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", _id);

      console.log("Registration successful:", response.data);

      // Initialize socket connection with the userId
      const newSocket = io("http://localhost:3000", {
        query: { _id },
      });
      setSocket(newSocket); // Store the socket instance in state
      newSocket.on("getOnlineUsers", (userId) => {
        console.log("Online users:", userId);
      });
      // Navigate to the dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error('Registration error:', error);
      alert("Error during registration. Please try again.");
    }
  };

  // Handle socket events and cleanup
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

  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold text-center mb-4">Sign Up</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
