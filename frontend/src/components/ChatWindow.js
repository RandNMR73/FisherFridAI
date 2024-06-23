import React from 'react';
import MessageItem from './MessageItem';

const ChatWindow = ({ messages }) => (
  <div className="chat-window">
    {messages.length === 0 ? (
      <p className="empty-chat">No messages yet. Start a conversation!</p>
    ) : (
      messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))
    )}
  </div>
);

export default ChatWindow;