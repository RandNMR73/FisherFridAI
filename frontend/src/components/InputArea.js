import React, { useState } from 'react';
import styled from 'styled-components';

const InputContainer = styled.form`
  padding: 24px;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
`;

const StyledInput = styled.input`
  flex-grow: 1;
  padding: 12px 20px;
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.2);
  color: white;
  margin-right: 15px;
  font-size: 16px;
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  } 
`;

const StyledButton = styled.button`
  padding: 12px 25px;
  border-radius: 25px;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  font-size: 16px;
  font-weight: 500;
  
  &:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
  }
`;

const InputArea = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      // setInput('');
    }
  };

  return (
    <InputContainer onSubmit={handleSubmit}>
      <StyledInput
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="What is your goal?"
      />
      <StyledButton type="submit">Send</StyledButton>
    </InputContainer>
  ); 
};

export default InputArea;