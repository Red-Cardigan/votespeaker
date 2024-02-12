import React, { useState } from 'react';
import ContentTypeDropdown from './ContentTypeDropdown';
import AudienceDropdown from './AudienceDropdown';
import DescriptionTextArea from './DescriptionTextArea';
import handleFormSubmission from '../apiHandler';
import ToneTextArea from './ToneSelectArea';
import VoteIntention from './VoteIntention';
import NameOccupationLocation from './NameOccupationLocation';
import StyleArea from './styleArea';

const FormComponent = () => {
  const [contentType, setContentType] = useState('');
  const [nameOccupationLocation, setNameOccupationLocation] = useState(''); // Updated variable name
  const [voteIntention, setIntention] = useState('');
  const [demographic, setAudience] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyleText] = useState(''); 
  const [responseText, setResponseText] = useState(''); 
  const [isCopied, setIsCopied] = useState(false); 
  const [selectedTones, setSelectedTones] = useState([]);

  const handleContentTypeChange = (value) => {
    setContentType(value);
  };

  const handleNameOccupationLocationChange = (value) => { // Updated function name
    setNameOccupationLocation(value); // Updated state setter
  };

  const handleIntentionChange = (intentionString) => {
    setIntention(intentionString);
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

  const handleStyleChange = (value) => {
    setStyle(value);
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
      nameOccupationLocation,
      voteIntention,
      demographic,
      description,
      style,
      tone: finalSentence,
    };
    try {
      const detailsSection = formData.description ? `\n\n${formData.description}.` : '';
      const prompt = `You're an expert writer of persuasive letters, and candidate for local Labour MP. Write a persuasive letter ${nameOccupationLocation}${formData.voteIntention} in the style of ${formData.style} to persuade them to vote for you in the upcoming election. Use their demographic category ${formData.demographic}. \n\n${formData.tone}${detailsSection}`;
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
        Write a personalised letter for...
      </div>
      <div className="subcontainer">
        <form onSubmit={handleSubmit}>
          {/* <ContentTypeDropdown onContentTypeChange={handleContentTypeChange} /> */}
          <div className="personal-details">
            <div className="details-left">
              <NameOccupationLocation onNameOccupationLocationChange={handleNameOccupationLocationChange} />
            </div>
            <div className="details-right">
              <VoteIntention onIntentionChange={handleIntentionChange}/>
              <StyleArea style={style} setStyle={setStyleText} />
            </div>
          </div>
          <AudienceDropdown onDemographicChange={handleDemographicChange} onToneChange={handleToneChange}/>
          <DescriptionTextArea description={description} setDescription={handleDescriptionChange} />
          <button type="submit" className="submit-button">Write Letter</button>
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
