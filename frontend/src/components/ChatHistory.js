import React from 'react';

const ChatHistory = ({ history }) => (
  <div className="chat-history">
    <h2>Chat History</h2>
    {history.length === 0 ? (
      <p>No chat history yet.</p>
    ) : (
      <ul>
        {history.map((chat, index) => (
          <li key={index} className="history-item">{chat.title}</li>
        ))}
      </ul>
    )}
  </div>
);

export default ChatHistory; 