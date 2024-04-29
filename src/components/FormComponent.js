import React, { useState, useRef, useEffect } from 'react';
import ContentTypeDropdown from './ContentTypeDropdown';
import AudienceDropdown from './AudienceDropdown';
import DescriptionTextArea from './DescriptionTextArea';
import handleFormSubmission from '../apiHandler';
import ToneTextArea from './ToneSelectArea';
import VoteIntention from './VoteIntention';
import NameOccupationLocation from './NameOccupationLocation';
import StyleArea from './styleArea';
import placeholders from './placeholders';
import ReactMarkdown from 'react-markdown';

const FormComponent = () => {
  const [colorIndex, setColorIndex] = useState(0);
  const partyInfo = [
    { color: '#E4003B', emoji: '🌹', name: 'a Labour Candidate', partyName: 'Labour' },          // Labour: Vibrant Red
    { color: '#004B87', emoji: '🌳', name: 'a Conservative', partyName: 'Conservative' },              // Conservatives: Darker Blue, Tree emoji
    { color: '#FAA61A', emoji: '🕊️', name: 'a Liberal Democrat', partyName: 'Liberal Democrat' },         // LibDem: Orange, Dove emoji
    { color: '#debe14', emoji: '🎗️', name: 'an SNP Candidate', partyName: 'SNP' },           // SNP: Muted Yellow, Ribbon emoji
    { color: '#6AB023', emoji: '🌍', name: 'a Green Party Candidate', partyName: 'Green Party' },     // Green Party: Green, Globe emoji
    { color: '#12B6CF', emoji: '➡️', name: 'a Reform UK Candidate', partyName: 'Reform UK' }       // Reform UK: Light Blue, Right Arrow emoji
  ];
  const [contentType, setContentType] = useState('');
  const [nameOccupationLocation, setNameOccupationLocation] = useState(''); // Updated variable name
  const [voteIntention, setIntention] = useState('');
  const [demographic, setAudience] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyleText] = useState(''); 
  const [responseText, setResponseText] = useState(''); 
  const [isCopied, setIsCopied] = useState(false); 
  const [selectedTones, setSelectedTones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const placeholderRef = useRef(null);

  useEffect(() => {
    if (isLoading) {
        const interval = setInterval(() => {
            setPlaceholderIndex(prevIndex => (prevIndex + 1) % placeholders.length);
        }, 3000);
        return () => clearInterval(interval);
    }
  }, [isLoading]);  // Dependency on isLoading to start/stop the interval

  useEffect(() => {
      if (placeholderRef.current) {
          const textLength = placeholderRef.current.textContent.length;
          placeholderRef.current.style.setProperty('--char-steps', textLength);
      }
  }, [placeholderIndex, placeholders]);

  const handleHeaderClick = () => {
    setColorIndex(prevIndex => (prevIndex + 1) % partyInfo.length); // Cycle through party info
  };

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
    setIsLoading(true); // Set isLoading to true
    setTimeout(() => {
      setIsCopied(false);
    }, 3000); // Reset copied status and isLoading after 3 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const partyName = partyInfo[colorIndex].partyName;
    const toneKeysSentence = `${selectedTones.map(t => t.key.toLowerCase()).join(', ').replace(/, ([^,]*)$/, ', and $1')}.`;
    const toneValuesSentence = selectedTones.map(t => t.value).join(' ');
    const finalSentence = `${toneKeysSentence} ${toneValuesSentence}`;

    const action = voteIntention.includes(partyName) ?
    "thank them, and encourage them to continue their support for the party by voting for you" :
    "identify their key concerns and persuade them to support you and your party";

    const formData = {
      partyName,
      contentType,
      nameOccupationLocation,
      voteIntention,
      demographic,
      description,
      style,
      action,
      tone: finalSentence,
    };
    try {
      const detailsSection = formData.description ? `\n\n${formData.description}.` : '';
      let prompt = `You're the candidate for local ${formData.partyName} MP, writing in the style of ${formData.style}. Write a concise letter ${nameOccupationLocation}${formData.voteIntention} to ${formData.action} in the upcoming election.\n\nBe ${formData.tone}.`;
      if (demographic) {
        prompt += `\n\nTailor your letter to their demographic "${formData.demographic}".`;
      }
      if (detailsSection) {
        prompt += `\n\nWhere relevant, use details from your campaign which align with their values. Campaign details:${detailsSection}`;
      }
      // Use elements from their broad demographic category "${formData.demographic}" 
      console.log(prompt)
      const response = await handleFormSubmission(prompt);
      if (response.generatedText) {
        setResponseText(response.generatedText.trim()); // Update the state with the response
      } else {
        setResponseText(f`No response - try again: ${Error}`);
        throw new Error('Invalid response from the server');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form.');
    } finally {
      setIsLoading(false); // Set isLoading to false after a short delay
    }
  };

  return (
    <div className={`container ${isLoading ? 'pulse-animation' : ''}`}>
      <div
        className="container-header"
        onClick={handleHeaderClick}
        style={{ backgroundColor: partyInfo[colorIndex].color }} // Set the background color
      >
        Dear...
        <div className="party-name">I am {partyInfo[colorIndex].name} {partyInfo[colorIndex].emoji} </div>
      </div>
      <div className="subcontainer">
        <form onSubmit={handleSubmit}>
          {/* <ContentTypeDropdown onContentTypeChange={handleContentTypeChange} /> */}
          <div className="personal-details">
            <div className="form-row">
              <NameOccupationLocation onNameOccupationLocationChange={handleNameOccupationLocationChange} />
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
          <div className={`response-body ${isLoading ? 'typing-animation' : ''}`}>
            {isLoading ? (
              <span key={placeholderIndex} ref={placeholderRef} className="placeholder-text">{placeholders[placeholderIndex]}</span>
            ) : (
              <ReactMarkdown className="markdown-response">{responseText || "Your personalized letter will appear here..."}</ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormComponent;
