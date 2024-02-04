import React, { useState, useEffect } from 'react';
import toneDescriptions from './toneDescriptions.json'; // Adjust the path as necessary
import PropTypes from 'prop-types';

const ToneTextArea = ({ currentLabel, onToneChange }) => {
  const [selectedTones, setSelectedTones] = useState([]);
  const [toneDescriptionsState, setToneDescriptionsState] = useState({});

  useEffect(() => {
    const labelTones = toneDescriptions[currentLabel] ? toneDescriptions[currentLabel][0] : {};
    setToneDescriptionsState(labelTones);
    setSelectedTones([]); // Reset selected tones when label changes
  }, [currentLabel]);

  const handleToneClick = (tone) => {
    setSelectedTones(prevSelectedTones => {
      const toneIndex = prevSelectedTones.findIndex(t => t.key === tone);
      let newSelectedTones = [...prevSelectedTones];

      if (toneIndex > -1) {
        newSelectedTones.splice(toneIndex, 1);
      } else if (prevSelectedTones.length < 3) {
        newSelectedTones.push({ key: tone, value: toneDescriptionsState[tone] });
      }

      onToneChange(newSelectedTones);
      return newSelectedTones;
    });
  };

  const tones = Object.keys(toneDescriptionsState);

  return (
    <div className="tone-text-area-container">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label>Use a tone which is...</label>
        <div className="max-selection-note" style={{ marginLeft: '20px', whiteSpace: 'nowrap' }}>(Max 3)</div>
      </div>
      <div>
        {tones.map(tone => (
          <button
            key={tone}
            type="button"
            className={`tone-label ${selectedTones.some(t => t.key === tone) ? 'selected' : ''}`}
            onClick={() => handleToneClick(tone)}
          >
            {tone}
          </button>
        ))}
      </div>
    </div>
  );
};

ToneTextArea.propTypes = {
  currentLabel: PropTypes.string,
  onToneChange: PropTypes.func.isRequired,
};

export default ToneTextArea;