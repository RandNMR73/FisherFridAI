import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  } 
`;

const RedoButton = ({ onClick }) => {
  return <StyledButton onClick={onClick}>Redo Last Input</StyledButton>;
};

export default RedoButton;