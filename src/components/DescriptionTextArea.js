import React from 'react';

const DescriptionTextArea = ({ description, setDescription }) => {
  return (
    <div className="description-text-area">
      <label htmlFor="description">To persuade them to...</label>
      <textarea
        id="description"
        name="description"
        className="text-area"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="4"
        placeholder="Encourage their friends to vote for Labour..."
      ></textarea>
    </div>
  );
};

export default DescriptionTextArea;
