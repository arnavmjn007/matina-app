import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { getMatches, getChatHistory } from '../../services/userService';

// WebSocket Imports
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const ChatsPage = ({ user }) => {
  const [matches, setMatches] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Helper function to scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch the list of matches (with last message data) when the component loads
  useEffect(() => {
    const fetchMatches = async () => {
      if (user?.id) {
        setIsLoading(true);
        try {
          const matchData = await getMatches(user.id);
          setMatches(matchData);
          if (matchData.length > 0) {
            // Automatically select the first match to show a conversation
            handleSelectChat(matchData[0].user);
          }
        } catch (error) {
          console.error("Failed to fetch matches:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchMatches();
    // Disabling ESLint as this should only run when the main user object changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Manage the WebSocket connection lifecycle
  useEffect(() => {
    if (selectedChat && user?.id) {
      setIsConnected(false);
      const stompClient = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
        onConnect: () => {
          console.log('WebSocket Connected!');
          setIsConnected(true);
          stompClient.subscribe(`/topic/messages/${user.id}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            if (receivedMessage.senderId === selectedChat.id) {
              setMessages(prevMessages => [...prevMessages, receivedMessage]);
            }
          });
        },
        onDisconnect: () => setIsConnected(false),
        onStompError: (frame) => console.error(frame),
      });
      stompClient.activate();
      stompClientRef.current = stompClient;
    }
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [selectedChat, user?.id]);

  // Fetch chat history when a user clicks on a match
  const handleSelectChat = async (matchUser) => {
    setSelectedChat(matchUser);
    try {
      const history = await getChatHistory(user.id, matchUser.id);
      setMessages(history);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
      setMessages([{ content: `You matched with ${matchUser.firstName}!`, senderId: 'System' }]);
    }
  };

  // Send a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !isConnected || !stompClientRef.current?.active) return;
    const chatMessage = {
      content: newMessage,
      senderId: user.id,
      recipientId: selectedChat.id,
    };
    stompClientRef.current.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(chatMessage),
    });
    setMessages([...messages, chatMessage]);
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
          {matches.map(matchData => (
            <div
              key={matchData.user.id}
              onClick={() => handleSelectChat(matchData.user)}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${selectedChat?.id === matchData.user.id ? 'bg-pink-50' : ''}`}
            >
              <img src={matchData.user.images?.[0]?.imageUrl} alt={matchData.user.firstName} className="w-14 h-14 rounded-full object-cover" />
              <div className="ml-4 overflow-hidden">
                <p className="font-semibold">{matchData.user.firstName}</p>
                <p className="text-sm text-gray-500 truncate">
                  {matchData.lastMessage ? (
                    matchData.lastMessage.senderId === user.id ? (
                      `You: ${matchData.lastMessage.content}`
                    ) : (
                      matchData.lastMessage.content
                    )
                  ) : (
                    "Start chatting!"
                  )}
                </p>
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
              {messages.map((msg, index) => (
                <div key={msg.id || index} className={`flex ${Number(msg.senderId) === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md px-4 py-3 rounded-2xl ${Number(msg.senderId) === user.id ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}>
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={isConnected ? "Type a message..." : "Connecting to chat..."}
                  disabled={!isConnected}
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none disabled:bg-gray-200"
                />
                <button
                  type="submit"
                  disabled={!isConnected || newMessage.trim() === ''}
                  className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 disabled:bg-pink-300"
                >
                  <Send size={24} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>{matches.length > 0 ? "Select a match to start chatting." : "You have no matches yet. Keep swiping!"}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsPage;