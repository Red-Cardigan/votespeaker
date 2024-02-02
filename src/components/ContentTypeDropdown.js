import React from 'react';

const ContentTypeDropdown = ({ onContentTypeChange }) => {
  return (
    <div>
      <label htmlFor="content-type">Write a...</label>
      <select
        name="content-type"
        id="content-type"
        className="dropdown"
        onChange={(e) => onContentTypeChange(e.target.value)}
      >
        <option value="">Select Type of Content</option>
        <option value="letter">Letter</option>
        <option value="leaflet">Leaflet</option>
        <option value="socialMediaPost">Social Media Post</option>
        <option value="keyLines">Set of Key Lines</option>
        <option value="speech">Speech</option>
        <option value="arguments">Set of Arguments</option>
      </select>
    </div>
  );
};

export default ContentTypeDropdown;
