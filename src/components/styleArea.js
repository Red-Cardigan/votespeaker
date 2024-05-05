import React, { useState } from 'react';

const StyleArea = ({ style, setStyle, color }) => {
  const [inputMethod, setInputMethod] = useState('buttons'); // 'buttons' or 'freeText'
  const [customStyle, setCustomStyle] = useState(''); // Separate state for custom style

  const predefinedStyles = [
    { label: 'Nigel Farage', value: 'nigel_farage' },
    { label: 'Boris Johnson', value: 'boris_johnson' },
    { label: 'Tony Blair', value: 'tony_blair' },
    { label: 'David Attenborough', value: 'david_attenborough' },
    { label: 'Sir Trevor McDonald', value: 'sir_trevor_mcdonald' },
  ];

  const handleStyleSelect = (selectedStyle) => {
    setStyle(selectedStyle);
    setInputMethod('buttons');
    setCustomStyle(''); // Clear custom style when a button is selected
  };

  const handleCustomStyleChange = (e) => {
    setCustomStyle(e.target.value);
    setStyle(''); // Clear predefined style selection
    setInputMethod('freeText');
  };

  const handleTextAreaFocus = () => {
    setInputMethod('freeText');
    setStyle(''); // Clear any selected style when text area is focused
  };

  return (
    <div className="style-area">
      <div className="style-select-area">
        {predefinedStyles.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleStyleSelect(option.label)}
            className={`style-button ${style === option.label ? 'active' : ''}`}
            style={{ backgroundColor: style === option.label ? color : '#fff' }} // Apply dynamic color
          >
            {option.label}
          </button>
        ))}
        <textarea
          className="style-text-area"
          value={customStyle}
          onChange={handleCustomStyleChange}
          onFocus={handleTextAreaFocus} // Handle focus to switch input method and clear style
          placeholder="Use your own style"
        ></textarea>
      </div>
    </div>
  );
};

export default StyleArea;