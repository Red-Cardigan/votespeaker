import React from 'react';

const DescriptionTextArea = ({ description, setDescription }) => {
  const handleChange = (e) => {
    // Prepend the specific text to the new value entered by the user
    const newValue = `Use relevant policy details from the following: ${e.target.value}`;
    setDescription(newValue);
  };

  return (
    <div className="description-text-area">
      <label htmlFor="description">Include details on your policies:</label>
      <textarea
        id="description"
        name="description"
        className="text-area"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="4"
        placeholder="Type or paste relevant policy here"
      ></textarea>
    </div>
  );
};

export default DescriptionTextArea;
