import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatHistory from './components/ChatHistory';
import ContentShapes from './components/ContentShapes';
import InputArea from './components/InputArea';
import Header from './components/Header';
import GlobalStyles from './GlobalStyles';
import RedoButton from './components/RedoButton';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-image:
  url('https://static.vecteezy.com/system/resources/previews/003/219/869/large_2x/dark-blue-red-abstract-blurred-background-vector.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
`;
const MainContent = styled.div`
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;
const ContentContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  max-height: 55vh
`;
const MenuButton = styled.button`
  position: fixed;
  top: 5px;
  left: 10px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  transition: all 0.3s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
} `;
function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [shapeCount, setShapeCount] = useState(3);
  const [menuOpen, setMenuOpen] = useState(false);
  const [key, setKey] = useState(0);
  const [lastInput, setLastInput] = useState(null);
  useEffect(() => {
    setShapeCount(Math.floor(Math.random() * 4) + 2);
  }, []);

const addEntry = (text) => {
  const newEntry = { id: Date.now(), text, timestamp: new Date() };
  setChatHistory(prev => [newEntry, ...prev]);
  setShapeCount(Math.floor(Math.random() * 4) + 2);
  setKey(prevKey => prevKey +1);
  setLastInput({ text, shapeCount: Math.floor(Math.random()*4) +2});
};
  const handleRedo = () => {
    if (lastInput) {
      setShapeCount(lastInput.shapeCount);
      setKey(prevKey => prevKey + 1);
    }
  };
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return ( 
  <>
    <GlobalStyles />
    <AppContainer>
      <Header />
      <MenuButton onClick={toggleMenu}>☰</MenuButton> 
      <MainContent>
        <ContentContainer>
          <InputArea onSendMessage={addEntry} />
          <ContentShapes key={key} count={shapeCount} />
        </ContentContainer>
      </MainContent>
      <ChatHistory history={chatHistory} isOpen={menuOpen} />
      <RedoButton onClick={handleRedo} />
      </AppContainer>
    </>
  ); 
}

export default App;