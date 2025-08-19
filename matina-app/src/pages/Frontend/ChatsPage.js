import {useState, useEffect } from 'react';
import { Send, Search } from 'lucide-react';
import { getAllUsers } from '../../services/userService'; // We'll reuse this to get dummy users

const ChatsPage = () => {
  const [matches, setMatches] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users to act as matches
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const users = await getAllUsers();
        setMatches(users);
        // Automatically select the first match to display
        if (users.length > 0) {
          handleSelectChat(users[0]);
        }
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatches();
  }, []);

  // Function to handle selecting a chat from the list
  const handleSelectChat = (user) => {
    setSelectedChat(user);
    // Create some dummy messages for the selected chat
    setMessages([
      { id: 1, text: `Hey! I saw we matched. How are you?`, sender: user.name },
      { id: 2, text: `Hi ${user.name}! I'm doing great, thanks for asking. How about you?`, sender: 'You' },
      { id: 3, text: `Doing well! Your profile looks really interesting.`, sender: user.name },
    ]);
  };

  // Function to handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'You',
    };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full text-xl font-semibold text-gray-500">Loading your matches...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Left Column: Matches List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Matches</h2>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search matches" 
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {matches.map(user => (
            <div
              key={user.id}
              onClick={() => handleSelectChat(user)}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 transition-colors ${selectedChat?.id === user.id ? 'bg-pink-50' : ''}`}
            >
              <img src={user.profileImages[0]} alt={user.name} className="w-14 h-14 rounded-full object-cover" />
              <div className="ml-4">
                <p className="font-semibold text-gray-800">{user.name} {user.lastName}</p>
                <p className="text-sm text-gray-500">Say hi!</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Chat Window */}
      <div className="w-2/3 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center p-4 border-b border-gray-200">
              <img src={selectedChat.profileImages[0]} alt={selectedChat.name} className="w-12 h-12 rounded-full object-cover" />
              <p className="ml-4 font-bold text-lg text-gray-800">{selectedChat.name} {selectedChat.lastName}</p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${msg.sender === 'You' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button type="submit" className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 transition-colors">
                  <Send size={24} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Select a match to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsPage;
