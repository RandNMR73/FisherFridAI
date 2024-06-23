import React from 'react';

const MessageItem = ({ message }) => (
  <div className={`message-item ${message.isUser ? 'user' : 'bot'}`}>
    <p>{message.text}</p>
  </div>
);

export default MessageItem;