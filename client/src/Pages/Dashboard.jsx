import React, { useState, useEffect } from 'react';
import Chat from '../Components/chat.jsx';

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [usersData, setUsersData] = useState([]);

  // Fetch user data from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        setUsersData(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Assuming the logged-in user's info is passed through context or props
  const userInfo = { username: 'JohnDoe', fullname: 'John Doe', profilePic: 'https://randomuser.me/api/portraits/men/1.jpg' };

  // Handle user selection for chatting
  const handleUserSelection = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-blue-600 text-white flex flex-col p-6 space-y-6">
        <h2 className="text-3xl font-bold">Chat App</h2>
        <p className="text-lg mt-2">Welcome, {userInfo.fullname}</p> {/* Display Full Name */}
        <ul className="space-y-4 mt-4">
          <li
            className={`cursor-pointer p-2 rounded-lg hover:bg-blue-500 transition duration-200 ${
              activeTab === 'home' ? 'bg-blue-500' : ''
            }`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </li>
          <li
            className={`cursor-pointer p-2 rounded-lg hover:bg-blue-500 transition duration-200 ${
              activeTab === 'chat' ? 'bg-blue-500' : ''
            }`}
            onClick={() => setActiveTab('chat')}
          >
            Chats
          </li>
          <li
            className={`cursor-pointer p-2 rounded-lg hover:bg-blue-500 transition duration-200 ${
              activeTab === 'profile' ? 'bg-blue-500' : ''
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </li>
          <li
            className={`cursor-pointer p-2 rounded-lg hover:bg-blue-500 transition duration-200 ${
              activeTab === 'settings' ? 'bg-blue-500' : ''
            }`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </li>
        </ul>

        {/* Users List (display in sidebar) */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white">Users</h3>
          <ul className="space-y-2 mt-4">
            {usersData.map((user) => (
              <li
                key={user._id}
                className={`cursor-pointer p-2 rounded-lg flex items-center space-x-4 ${
                  user.online ? 'bg-green-500' : 'bg-gray-400'
                } hover:bg-green-400 transition duration-200`}
                onClick={() => handleUserSelection(user)}
              >
                <img
                  src={user.profilePic || 'default_profile_pic_url'} // Default profile picture if none available
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-white">{user.name} - {user.online ? 'Online' : 'Offline'}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex-1 p-6 ml-1/4">
        <h1 className="text-4xl font-bold text-gray-700">
          {activeTab === 'home' && 'Home'}
          {activeTab === 'chat' && 'Chats'}
          {activeTab === 'profile' && 'Profile'}
          {activeTab === 'settings' && 'Settings'}
        </h1>

        {/* Chat Section */}
        {activeTab === 'chat' && (
          <div className="mt-8 flex flex-col">
            <h3 className="text-2xl font-semibold text-gray-800">
              {selectedUser ? `Chatting with ${selectedUser.name}` : 'Select a user to chat with'}
            </h3>

            {selectedUser ? (
              <div className="mt-4 flex-1 bg-white p-4 rounded-lg shadow-md">
                <Chat selectedUser={selectedUser} />
              </div>
            ) : (
              <div className="mt-4 text-gray-600">Please select a user to start chatting.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
