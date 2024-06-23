import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ComfortSelector from "./ComfortSelector";

function App() {
    const [currentTopic, setCurrentTopic] = useState("");
    const [selectedComfortLevel, setSelectedComfortLevel] = useState("");

    const initTree = async (topic) => {
        try {
            await axios.post('http://verylocal:5000/set_up_tree', { topic: topic });
            await getNextUncomfortable();
        } catch (error) {
            console.error('There was an error setting up the tree!', error);
        }
    }

    useEffect(() => {
        initTree("creating an app with React");
    }, []);

    const getNextUncomfortable = async () => {
        try {
            const response = await axios.get('http://verylocal:5000/get_next_uncomfortable');
            console.log("JS", response.data);
            if (response.data !== 'All topics are comfortable') {
                setCurrentTopic(response.data.next_uncomfortable);
            } else {
                setCurrentTopic("");
            }
            // print the current tree
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
            await axios.post('http://verylocal:5000/add_info', { topic, comfort_level: comfortLevelToNumber(comfort_level) });
            setSelectedComfortLevel(""); // Clear the selection
            await getNextUncomfortable();
        } catch (error) {
            console.error('There was an error updating the comfort level!', error);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Prerequisite Checker</h1>
                <h2>I want to learn about creating an app with React</h2>
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
                {!currentTopic && <p>All topics are comfortable!</p>}
            </header>
        </div>
    );
}

export default App;
