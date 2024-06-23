import React, { useState } from 'react';
import ChatHistory from './components/ChatHistory';
import ChatWindow from '.components/ChatWindow';
import InputArea from './components/InputArea';
import './styles.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  const addMessage = (text, isUser = true) => {
    setMessages([...messages, { text, isUser }]);
  };

  return (
    <div className="app-container">
      <ChatHistory history={chatHistory} />
      <div className="main-chat-area">
        <ChatWindow messages={messages} />
        <InputArea onSendMessage={addMessage} />
      </div>
    </div>
  );
}

export default App;