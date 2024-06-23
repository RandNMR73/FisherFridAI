import React, { useEffect, useState } from 'react';
import './ComfortSelector.css';

const ComfortSelector = ({ topic, selectedComfortLevel, onComfortSelect }) => {
  const [selectedComfort, setSelectedComfort] = useState(null);

  useEffect(() => {
    setSelectedComfort(selectedComfortLevel);
  }, [selectedComfortLevel]);

  const comfortLevels = [
    'Very Uncomfortable',
    'Uncomfortable',
    'Comfortable',
    'Very Comfortable'
  ];

  const handleSelect = (level) => {
    setSelectedComfort(level);
    if (onComfortSelect) {
      onComfortSelect(level);
    }
  };

  return (
    <div className="comfort-selector">
      <h2>{topic}</h2>
      <div className="bubble-container">
        {comfortLevels.map((level, index) => (
          <button
            key={index}
            className={`bubble ${selectedComfort === level ? 'selected' : ''}`}
            onClick={() => handleSelect(level)}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ComfortSelector;
