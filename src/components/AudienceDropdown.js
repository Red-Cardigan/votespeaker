import React from 'react';

const AudienceDropdown = ({ onAudienceChange }) => {
  return (
    <div className="dropdown-container">
      <label htmlFor="audience">For a...</label>
      <select
        id="audience"
        className="dropdown"
        onChange={(e) => onAudienceChange(e.target.value)}
      >
        <option value="">Select Audience</option>
        <option value="high-status individual">High-status individual</option>
        <option value="single mother in poor area">Single mother in poor area</option>
        <option value="young family">Young family</option>
        <option value="well-informed individual with clear opinions">Well-informed individual with clear opinions</option>
      </select>
    </div>
  );
};

export default AudienceDropdown;
