import React from 'react';

const DescriptionTextArea = ({ description, setDescription }) => {
  return (
    <div className="description-text-area">
      <label htmlFor="description">Include the following details:</label>
      <textarea
        id="description"
        name="description"
        className="text-area"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="4"
        placeholder="Add specific details about the person or audience"
      ></textarea>
    </div>
  );
};

export default DescriptionTextArea;
