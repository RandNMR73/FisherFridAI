import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://verylocal:5000/specify', { prompt });
      setResult(JSON.stringify(response.data.result, null, 2));
    } catch (error) {
      console.error('There was an error fetching the results!', error);
      setResult('Error: ' + error.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Specificity Checker</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt"
          />
          <button type="submit">Check Specificity</button>
        </form>
        <div>
          <h2>Result:</h2>
          <pre>{result}</pre>
        </div>
      </header>
    </div>
  );
}

export default App;