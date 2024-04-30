import React, { useState } from 'react';

const StyleArea = ({ style, setStyle }) => {
  const [inputMethod, setInputMethod] = useState('dropdown'); // 'dropdown' or 'freeText'

  const predefinedStyles = [
    { label: 'None', value: '' },
    { label: 'Nigel Farage', value: 'nigel_farage' },
    { label: 'Boris Johnson', value: 'boris_johnson' },
    { label: 'Tony Blair', value: 'tony_blair' },
    { label: 'David Attenborough', value: 'david_attenborough' },
    { label: 'Sir Trevor McDonald', value: 'sir_trevor_mcdonald' },
  ];

  const handleStyleChange = (e) => {
    if (inputMethod === 'dropdown') {
      // For dropdown, use the selected option's text as the style
      const selectedText = e.target.options[e.target.selectedIndex].text;
      setStyle(selectedText);
    } else {
      // For freeText, the value is directly used
      setStyle(e.target.value);
    }
  };

  const toggleInputMethod = () => {
    if (inputMethod === 'dropdown') {
      setInputMethod('freeText');
      setStyle(''); // Reset the style value when switching to free text
    } else {
      setInputMethod('dropdown');
      // Optionally, you can set a default style when switching back to dropdown
    }
  };

  return (
    <div className="style-area style-select-area">
      <div>
        <label htmlFor="style-select">Use this style:</label>
      </div>
      {inputMethod === 'dropdown' ? (
        <>
            <select
              id="style-select" // Added id to associate with the label
              className="dropdown"
              value={style}
              onChange={handleStyleChange}
            >
              {predefinedStyles.map((option) => (
                <option key={option.value} value={option.label}>{option.label}</option>
              ))}
            </select>
        </>
      ) : (
        <>
          <textarea
            className="text-area"
            value={style}
            onChange={handleStyleChange}
            rows="4"
            placeholder="Add a style"
          ></textarea>
        </>
      )}
      <div className="switch-label">Add your own style:</div>
      <label className="switch">
        <input
          type="checkbox"
          checked={inputMethod === 'freeText'}
          onChange={toggleInputMethod}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default StyleArea;