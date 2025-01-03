import React, { useState } from 'react';

const Chat = ({ selectedUser }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would emit the message to the server using Socket.io
      // For now, we're just adding it locally to simulate the behavior.
      setMessages([...messages, { from: 'You', text: message }]);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <div className="text-gray-600">No messages yet.</div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="p-2">
              <span className="font-bold text-gray-700">{msg.from}: </span>
              <span>{msg.text}</span>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSendMessage}
          className="ml-4 bg-blue-500 text-white p-3 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
