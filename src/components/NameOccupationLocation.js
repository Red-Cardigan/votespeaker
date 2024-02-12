import React, { useState, useEffect } from 'react';

function NameOccupationLocation({ onNameOccupationLocationChange }) {
  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [location, setLocation] = useState('');

  // Function to construct the output string based on the available values
  const constructOutputString = (newName, newOccupation, newLocation) => {
    let outputString = "to ";
    if (newName) outputString += `${newName}`;
    if (newOccupation) outputString += `, a ${newOccupation}`;
    if (newLocation) outputString += ` from ${newLocation}`;

    // Adjusting the string based on which parts are present
    outputString = outputString.replace("to , a", "to").replace("to from", "from");

    // Call the callback with the constructed string
    onNameOccupationLocationChange(outputString.trim());
  };

  // Effect to call constructOutputString whenever name, occupation, or location changes
  useEffect(() => {
    constructOutputString(name, occupation, location);
  }, [name, occupation, location]); // Only re-run the effect if name, occupation, or location changes

  // Handlers to update state
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleOccupationChange = (e) => {
    setOccupation(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  return (
    <div className="nol-container">
      <div className="form-group">
        <label htmlFor="name">Name: </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
          className="text-input name-input" // Added specific class for name input
        />
      </div>
      {/* <div className="form-group">
        <label htmlFor="occupation">Occupation: </label>
        <input
          type="text"
          id="occupation"
          value={occupation}
          onChange={handleOccupationChange}
          className="text-input occupation-input" // Added specific class for occupation input
        />
      </div> */}
      <div className="form-group">
        <label htmlFor="location">From: </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={handleLocationChange}
          className="text-input location-input" // Added specific class for location input
        />
      </div>
    </div>
  );
}

export default NameOccupationLocation;