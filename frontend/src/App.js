import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState([]);

  const checkSpecificity = useCallback(async (newPrompt) => {
    try {
      const response = await axios.post('http://verylocal:5000/specify', { prompt: newPrompt });
      setResult(response.data.result);
    } catch (error) {
      console.error('There was an error fetching the results!', error);
      setResult(['Error: ' + error.message]);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await checkSpecificity(prompt);
  };

  const handleResultClick = async (item) => {
    setPrompt(item);
    await checkSpecificity(item);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Specificity Checker</h1>
        <form onSubmit={handleSubmit}>
          <label style={{marginRight: 10}}>
            I want to learn about
            <input style={{marginLeft: 10}}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your topic"
            />
          </label>
          <button type="submit">Check Specificity</button>
        </form>
        <div>
          <h2>Result:</h2>
          <ul>
            {result.map((item, index) => (
              <li key={index}>
                <button onClick={() => handleResultClick(item)}>{item}</button>
              </li>
            ))}
            {prompt && (
              <li>
                <button onClick={() => handleResultClick(`Something else about ${prompt}`)}>
                  Something else about {prompt}
                </button>
              </li>
            )}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;