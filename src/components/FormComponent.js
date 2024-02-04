import React, { useState } from 'react';
import ContentTypeDropdown from './ContentTypeDropdown';
import AudienceDropdown from './AudienceDropdown';
import DescriptionTextArea from './DescriptionTextArea';
// import ToneSelectArea from './ToneSelectArea';
import handleFormSubmission from '../apiHandler';
import ToneTextArea from './ToneSelectArea';

const FormComponent = () => {
  const [contentType, setContentType] = useState('');
  const [demographic, setAudience] = useState('');
  const [description, setDescription] = useState('');
  const [responseText, setResponseText] = useState(''); // Added this line
  const [isCopied, setIsCopied] = useState(false); // Added this line
  const [selectedTones, setSelectedTones] = useState([]);

  const handleContentTypeChange = (value) => {
    setContentType(value);
  };

  const handleDemographicChange = (value) => {
    setAudience(value);
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const handleToneChange = (selectedTones) => {
    setSelectedTones(selectedTones);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(responseText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000); // Reset copied status after 3 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toneKeysSentence = `Be ${selectedTones.map(t => t.key.toLowerCase()).join(', ').replace(/, ([^,]*)$/, ', and $1')}.`;
    const toneValuesSentence = selectedTones.map(t => t.value).join(' ');
    const finalSentence = `${toneKeysSentence} ${toneValuesSentence}`;

    const formData = {
      contentType,
      demographic,
      description,
      tone: finalSentence,
    };
    try {
      const prompt = `You're an expert political ${formData.contentType} writer. Write a ${formData.contentType} for a member of the demographic "${formData.demographic}" to persuade them to vote for you in the upcoming election. \n\n${formData.tone}. \n\nInclude the following details:\n\n${formData.description}.`;
      console.log(prompt)
      const response = await handleFormSubmission(prompt);
      if (response.generatedText) {
        setResponseText(response.generatedText.trim()); // Update the state with the response
      } else {
        throw new Error('Invalid response from the server');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form.');
    }
  };

  return (
    <div className="container">
      <div className="container-header">
        LLMs like it when you're clear and specific
      </div>
      <div className="subcontainer">
        <form onSubmit={handleSubmit}>
          <ContentTypeDropdown onContentTypeChange={handleContentTypeChange} />
          <AudienceDropdown onDemographicChange={handleDemographicChange} onToneChange={handleToneChange}/>
          <DescriptionTextArea description={description} setDescription={handleDescriptionChange} />
          <button type="submit" className="submit-button">Write Text</button>
        </form>
        <div className="response-container">
          <div className={`response-header ${isCopied ? 'copied' : ''}`} onClick={handleCopy}>
            Response
            <span className="copy-text">{isCopied ? 'Copied' : 'Copy'}</span>
          </div>
          <div className="response-body">
            {responseText || <span className="placeholder-text">Your message will appear here...</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormComponent;
