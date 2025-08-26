import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
// FIX: Import the correct function
import { getMatches } from '../../services/userService';

const ChatsPage = ({ user }) => {
  const [matches, setMatches] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      if (user) {
        setIsLoading(true);
        try {
          // FIX: Call the correct function with the user's ID
          const users = await getMatches(user.id);
          setMatches(users);
          if (users.length > 0) {
            handleSelectChat(users[0]);
          }
        } catch (error) {
          console.error("Failed to fetch matches:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchMatches();
  }, [user]);

  const handleSelectChat = (match) => {
    setSelectedChat(match);
    setMessages([
      { id: 1, text: `You matched with ${match.firstName}!`, sender: 'System' },
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    const message = { id: Date.now(), text: newMessage, sender: 'You' };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  if (isLoading) {
    return <div className="text-center font-semibold text-gray-500">Loading your matches...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b"><h2 className="text-2xl font-bold">Matches</h2></div>
        <div className="flex-1 overflow-y-auto">
          {matches.map(match => (
            <div
              key={match.id}
              onClick={() => handleSelectChat(match)}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${selectedChat?.id === match.id ? 'bg-pink-50' : ''}`}
            >
              <img src={match.images?.[0]?.imageUrl} alt={match.firstName} className="w-14 h-14 rounded-full object-cover" />
              <div className="ml-4">
                <p className="font-semibold">{match.firstName}</p>
                <p className="text-sm text-gray-500">Start chatting!</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-2/3 flex flex-col">
        {selectedChat ? (
          <>
            <div className="flex items-center p-4 border-b">
              <img src={selectedChat.images?.[0]?.imageUrl} alt={selectedChat.firstName} className="w-12 h-12 rounded-full object-cover" />
              <p className="ml-4 font-bold text-lg">{selectedChat.firstName}</p>
            </div>
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md px-4 py-3 rounded-2xl ${msg.sender === 'You' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-white border-t">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none"
                />
                <button type="submit" className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600">
                  <Send size={24} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>You have no matches yet. Keep swiping!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsPage;