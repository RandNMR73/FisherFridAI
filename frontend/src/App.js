import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import ChatHistory from './components/ChatHistory';
import ContentShapes from './components/ContentShapes';
import InputArea from './components/InputArea';
import Header from './components/Header';
import GlobalStyles from './GlobalStyles';
import RedoButton from './components/RedoButton';
import axios from 'axios';
import {useCallback} from 'react';
import ComfortSelector from "./ComfortSelector";
import BlockView from "./components/BlockView";


const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-image: url('https://static.vecteezy.com/system/resources/previews/003/219/869/large_2x/dark-blue-red-abstract-blurred-background-vector.jpg');
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

// import { useTrail } from 'react-spring';


// const ContentShapes = ({ result }) => {
//     const trail = useTrail(result.length, {
//         from: { opacity: 0, transform: 'translate3d(0,40px,0)' },
//         to: { opacity: 1, transform: 'translate3d(0,0px,0)' },
//         config: { mass: 1, tension: 280, friction: 20 },
//     });
//     return (
//         <ShapesContainer count={result.length}>
//             {trail.map((props, index) => (
//                 <Shape key={index} style={props}>
//                     <p>{result[index]}</p>
//                 </Shape>
//             ))}
//         </ShapesContainer>
//     );
// };

function App() {
    const [chatHistory, setChatHistory] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [key, setKey] = useState(0);
    const [lastInput, setLastInput] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState([]);
    const [isSecondProgram, setIsSecondProgram] = useState(false);
    const [currentTopic, setCurrentTopic] = useState("");
    const [selectedComfortLevel, setSelectedComfortLevel] = useState("");
    const [goal, setGoal] = useState('');

    const checkSpecificity = useCallback(async (newPrompt) => {
        if (!newPrompt) {
            console.error('No prompt provided');
            return;
        }
        try {
            const response = await axios.post('http://verylocal:5000/specify', {prompt: newPrompt});
            setResult(response.data.result);
            if (response.data.result.length === 1 && response.data.result[0] === 'done') {
                setIsSecondProgram(true);
                setGoal(newPrompt);
                await initTree(newPrompt);
            }
        } catch (error) {
            console.error('Error details:', error.response || error);
            setResult(['Error: ' + (error.response?.data?.error || error.message)]);
        }
    }, []);


    const addEntry = async (text) => {
        if (!text) return;
        setPrompt(text);
        await checkSpecificity(text);
        const newEntry = {id: Date.now(), text, timestamp: new Date()};
        setChatHistory(prev => [newEntry, ...prev]);
        setKey(prevKey => prevKey + 1);
        setLastInput({text, result});
    };

    const handleShapeClick = async (content) => {
        console.log("Shape clicked with content:", content);
        setPrompt(content);
        await checkSpecificity(content);
    };

    const handleRedo = () => {
        if (lastInput) {
            setPrompt(lastInput.text);
            checkSpecificity(lastInput.text);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // New functions for the second program
    const initTree = async (topic) => {
        try {
            const formattedTopic = topic.startsWith("I want to learn ") ? topic : `I want to learn ${topic}`;
            console.log("Formatted topic:", formattedTopic);
            await axios.post('http://verylocal:5000/set_up_tree', {topic: formattedTopic});
            console.log("Tree set up!");
            await getNextUncomfortable();
        } catch (error) {
            console.error('There was an error setting up the tree!', error);
        }
    }

    const getNextUncomfortable = async () => {
        try {
            const response = await axios.get('http://verylocal:5000/get_next_uncomfortable');
            console.log("JS", response.data);
            if (response.data !== 'All topics are comfortable') {
                setCurrentTopic(response.data.next_uncomfortable);
            } else {
                setCurrentTopic("");
            }
            const tree = await axios.get('http://verylocal:5000/print_tree');
            console.log("TREE", tree.data.tree);
        } catch (error) {
            console.error('There was an error fetching the next uncomfortable topic!', error);
        }
    }

    const comfortLevelToNumber = (comfort_level) => {
        switch (comfort_level) {
            case 'Very Uncomfortable':
                return -2;
            case 'Uncomfortable':
                return -1;
            case 'Comfortable':
                return 1;
            case 'Very Comfortable':
                return 2;
            default:
                return -10;
        }
    }

    const handleComfortSelect = async (topic, comfort_level) => {
        console.log(`Selected comfort level for ${topic}: ${comfort_level}`);
        try {
            await axios.post('http://verylocal:5000/add_info', {
                topic,
                comfort_level: comfortLevelToNumber(comfort_level)
            });
            setSelectedComfortLevel("");
            await getNextUncomfortable();
        } catch (error) {
            console.error('There was an error updating the comfort level!', error);
        }
    };

    const [videoList, setVideoList] = useState([]);

    const fetchVideoList = useCallback(async () => {
        try {
            const response = await axios.get('http://verylocal:5000/generate_path');
            setVideoList(response.data.path);
        } catch (error) {
            console.error('Error fetching video list:', error);
        }
    }, []);

    useEffect(() => {
        if (isSecondProgram) {
            fetchVideoList();
        }
    }, [isSecondProgram, fetchVideoList]);

    return (
        <div>
            <GlobalStyles/>
            <AppContainer>
                <Header/>
                <MenuButton onClick={toggleMenu}>☰</MenuButton>
                <MainContent>
                    {!isSecondProgram ? (
                        <ContentContainer>
                            <InputArea
                                onSendMessage={addEntry}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                            <ContentShapes
                                key={key}
                                result={result}
                                onShapeClick={handleShapeClick}
                            />
                        </ContentContainer>
                    ) : (
                        <div className="App">
                            <header className="App-header">
                                <h1>Prerequisite Checker</h1>
                                <h2>{goal}</h2>
                                {currentTopic && (
                                    <div>
                                        <h3>Current Topic:</h3>
                                        <p>{currentTopic}</p>
                                        <ComfortSelector
                                            topic={currentTopic}
                                            selectedComfortLevel={selectedComfortLevel}
                                            onComfortSelect={(comfort_level) => {
                                                setSelectedComfortLevel(comfort_level);
                                                handleComfortSelect(currentTopic, comfort_level);
                                            }}
                                        />
                                    </div>
                                )}
                                {!currentTopic}
                                {videoList.length > 0 && (
                                    <div>
                                        <h3>Recommended Videos:</h3>
                                        <ul>
                                            {videoList.map((video, index) => (
                                                <li key={index}>{video}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </header>
                        </div>
                    )}
                </MainContent>
                <ChatHistory history={chatHistory} isOpen={menuOpen}/>
                <RedoButton onClick={handleRedo}/>
            </AppContainer>
        </div>
    );
}

export default App;