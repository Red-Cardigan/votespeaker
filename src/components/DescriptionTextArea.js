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
        placeholder="Add details about your concerns and the audience"
      ></textarea>
    </div>
  );
};

export default DescriptionTextArea;
