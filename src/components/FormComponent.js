import React, { useState } from 'react';
import ContentTypeDropdown from './ContentTypeDropdown';
import AudienceDropdown from './AudienceDropdown';
import DescriptionTextArea from './DescriptionTextArea';
import ToneTextArea from './ToneTextArea';
import handleFormSubmission from '../apiHandler';

const FormComponent = () => {
  const [contentType, setContentType] = useState('');
  const [audience, setAudience] = useState('');
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState('');
  const [responseText, setResponseText] = useState(''); // Added this line
  const [isCopied, setIsCopied] = useState(false); // Added this line

  const handleContentTypeChange = (value) => {
    setContentType(value);
  };

  const handleAudienceChange = (value) => {
    setAudience(value);
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const handleToneChange = (value) => {
    setTone(value);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(responseText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000); // Reset copied status after 3 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      contentType,
      audience,
      description,
      tone,
    };
    try {
      const prompt = `Write a ${formData.contentType} for a ${formData.audience} to persuade them to ${formData.description}. Use a tone which is ${formData.tone}.`;
      const response = await handleFormSubmission(prompt);
      alert('Form submitted successfully!');
      setResponseText(response.trim()); // Updated this line to set the response text
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form.');
    }
  };

  return (
    <div className="container">
      <div class="container-header">
        LLMs like it when you're clear and specific
      </div>
      <form onSubmit={handleSubmit}>
        <ContentTypeDropdown onContentTypeChange={handleContentTypeChange} />
        <AudienceDropdown onAudienceChange={handleAudienceChange} />
        <DescriptionTextArea description={description} setDescription={handleDescriptionChange} />
        <ToneTextArea onToneChange={handleToneChange} />
        <button type="submit" className="submit-button">Submit</button>
      </form>
      <div className="response-container">
        <div className={`response-header ${isCopied ? 'copied' : ''}`} onClick={handleCopy}>
          Response
          <span className="copy-text">{isCopied ? 'Copied' : 'Copy'}</span>
        </div>
        <div className="response-body">
          {responseText || <span className="placeholder-text">Your generated text will appear here...</span>}
        </div>
      </div>
    </div>
  );
};

export default FormComponent;
