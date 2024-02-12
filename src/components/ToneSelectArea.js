import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ToneTextArea = ({ currentLabel, onToneChange }) => {
  const [selectedTones, setSelectedTones] = useState([]);
  const [toneDescriptionsState, setToneDescriptionsState] = useState({});

  useEffect(() => {
    // Split the currentLabel to extract the demographic system and the category
    const [demographicSystem, category] = currentLabel.split(':');

    // Determine the file name based on the demographic system
    let fileName;
    switch (demographicSystem) {
      case 'Mosaic':
        fileName = 'toneDescriptions.json';
        break;
      case 'ValueModes':
        fileName = 'valuemodesTones.json';
        break;
      case 'MoreInCommon':
        fileName = 'moreincommonTones.json';
        break;
      default:
        console.log(`No matching file for demographic system: ${demographicSystem}`);
        return;
    }

    // Dynamically import the JSON file based on the demographic system
    import(`./${fileName}`)
      .then((module) => {
        // Handle different JSON structures
        let labelTones = {};
        if (demographicSystem === 'Mosaic') {
          labelTones = module.default[category] ? module.default[category][0] : {};
        } else if (demographicSystem === 'ValueModes') {
          labelTones = module.default[category] ? module.default[category].Tones : {};
        } else if (demographicSystem === 'MoreInCommon') {
          // Assuming a similar structure to ValueModes for demonstration
          labelTones = module.default[category] ? module.default[category].Tones : {};
        }
        setToneDescriptionsState(labelTones);
        setSelectedTones([]); // Reset selected tones when label changes
      })
      .catch((error) => {
        console.error(`Failed to load ${fileName}`, error);
        setToneDescriptionsState({});
      });

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