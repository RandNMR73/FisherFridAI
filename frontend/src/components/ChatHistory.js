import React from 'react';
import styled from 'styled-components';

const HistoryContainer = styled.div`
  width: 200px;
  height: 100%;
  position: fixed;
  top: 0;
  left: ${props => props.isOpen ? '0' : '-300px'};
  transition: left 0.3s ease-in-out;
  background: rgba(255, 255, 255, 0.9);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  padding: 80px 24px 24px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 999;
`;

const HistoryTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
`;

const HistoryItem = styled.div`
  padding: 15px;
  margin-bottom: 12px;
  transition: all 0.3s ease-in-out;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    transform: translateX(10px);
    background-color: rgba(0, 0, 0, 0.1);
  }

  p {
    margin: 0 0 8px 0;
    color: #333;
    font-size: 14px;
  }

  small {
    color: #666;
    font-size: 12px;
  }
`;

const ChatHistory = ({ history, isOpen, onLogClick }) => (
  <HistoryContainer isOpen={isOpen}>
    <HistoryTitle>Input History</HistoryTitle>
    {history.length === 0 ? (
      <p>No input history yet.</p>
    ) : (
      history.map((entry) => (
        <HistoryItem key={entry.id} onClick={() => onLogClick(entry)}>
          <p>{entry.text}</p>
          <small>{new Date(entry.timestamp).toLocaleString()}</small>
        </HistoryItem>
      ))
    )}
  </HistoryContainer>
);

export default ChatHistory;