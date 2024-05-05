import React, { useState, useRef, useEffect } from 'react';
import ContentTypeDropdown from './ContentTypeDropdown';
import AudienceDropdown from './AudienceDropdown';
import DescriptionTextArea from './DescriptionTextArea';
import { handleFormSubmission, monitorJobStatus, checkJobStatus } from '../apiHandler';
import ToneTextArea from './ToneSelectArea';
import VoteIntention from './VoteIntention';
import NameOccupationLocation from './NameOccupationLocation';
import StyleArea from './styleArea';
import placeholders from './placeholders';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenFancy, faDownload, faCopy, faCheckDouble } from '@fortawesome/free-solid-svg-icons';

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
  const [prompt, setPrompt] = useState("Initial prompt text");
  const [contentType, setContentType] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [constituency, setConstituency] = useState('');
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

  const updatePrompt = () => {
    let action;
    
    if (description) {
      action = voteIntention.includes(partyInfo[colorIndex].partyName) ?
        "thank them, and encourage them to continue their support for the party using the following policies: \n${description}" :
        "identify their key concerns and persuade them to support you and your party using the following policies: \n${description}";
    } else {
      action = voteIntention.includes(partyInfo[colorIndex].partyName) ?
        "thank them, and encourage them to continue their support for the party" :
        "identify their key concerns and persuade them to support you and your party";
    }

    let newPrompt = `
    You're ${candidateName}, the candidate for local ${partyInfo[colorIndex].partyName} MP in ${constituency}, writing to a voter in the style of ${style}. 
    Write a concise letter ${nameOccupationLocation} ${voteIntention} to ${action} in the upcoming election.
    `

    if (selectedTones.length > 0) {
      newPrompt += `\n\nBe ${selectedTones.map(t => t.value).join(', ')}.`;
    }

    if (demographic) {
      newPrompt += `\n\nTailor your letter to their demographic "${demographic}".`;
    }

    setPrompt(newPrompt);
  };

  const downloadPdf = async (prompt) => {
    const doc = new jsPDF();
  
    // Define the styles for the PDF
    doc.setFont('Calibri'); // Set font to Helvetica for simplicity
    doc.setFontSize(12); // Set the base font size
  
    // Define margins and page width
    const margins = { top: 20, left: 20, bottom: 30 };
    const pageWidth = doc.internal.pageSize.width - margins.left * 2;
  
    // Function to add footer
    const addFooter = () => {
      const footerY = doc.internal.pageSize.height - margins.bottom;
      doc.setDrawColor(255, 0, 0); // Set draw color to red
      doc.setLineWidth(0.5);
      doc.line(margins.left, footerY, doc.internal.pageSize.width - margins.left, footerY);
  
      const logo = 'public/banner.jpg';
      doc.addImage(logo, 'JPEG', margins.left, footerY + 3, 30, 15);
  
      const linkText = 'Write letters like this at scale';
      doc.setTextColor(0, 0, 139); // Darker blue
      const xPositionForLink = doc.internal.pageSize.width - margins.left - doc.getTextWidth(linkText);
      doc.textWithLink(linkText, xPositionForLink, footerY + 10, { url: 'https://wyza.uk' });
      doc.setFont('Calibri'); // Reset font style after link
      doc.setTextColor(0, 0, 0); //Set text to black
    };
  
    // Add header and response text
    doc.setFontSize(16);
    doc.text('Your Letter', margins.left, margins.top);
    doc.setFontSize(12);
    const wrappedText = doc.splitTextToSize(responseText, pageWidth);
    doc.text(wrappedText, margins.left, margins.top + 10);
  
    // Add footer on the first page
    addFooter();
  
    // Add a new page for the prompt
    doc.addPage();
  
    // Add header and prompt text
    doc.setFontSize(16);
    doc.text('Prompt Used to Generate This Letter', margins.left, margins.top);
    doc.setFontSize(12);
    const wrappedPrompt = doc.splitTextToSize(prompt, pageWidth);
    doc.text(wrappedPrompt, margins.left, margins.top + 10);
  
    // Add footer on the prompt page
    addFooter();
  
    // Save the PDF
    doc.save('AI-campaign-letter.pdf');
  };

  useEffect(() => {
    if (isLoading) {
        const interval = setInterval(() => {
            setPlaceholderIndex(prevIndex => (prevIndex + 1) % placeholders.length);
        }, 3000);
        return () => clearInterval(interval);
    }
  }, [isLoading]);  // Dependency on isLoading to start/stop the interval

  useEffect(() => {
    updatePrompt();
  }, [partyInfo, colorIndex, nameOccupationLocation, voteIntention, demographic, description, style, selectedTones]); // Add all dependencies that should trigger an update

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
    setTimeout(() => {
      setIsCopied(false);
    }, 3000); // Reset copied status and isLoading after 3 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Call updatePrompt to ensure the prompt state is updated
    updatePrompt();
    console.log(prompt)

    // Now, use the updated prompt state in your submission logic
    try {
      const response = await monitorJobStatus(prompt); // Use the updated prompt state
      if (response) {
        setResponseText(response);
      } else {
        throw new Error('No response received from the server.');
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
      <div className="container-header" style={{ backgroundColor: partyInfo[colorIndex].color }}>
        <div>
          <h2>Your Information</h2>
          <label>
            Name:
            <input className="text-input" value={candidateName} onChange={e => setCandidateName(e.target.value)} />
          </label>
          <label>
            Constituency:
            <input className="text-input" value={constituency} onChange={e => setConstituency(e.target.value)} />
          </label>
        </div>
        <div className="party-names">
          {partyInfo.map((party, index) => (
            <div
              key={party.partyName}
              className="party-name"
              onClick={() => setColorIndex(index)}
              style={{ backgroundColor: party.color }}
            >
              <div>I am a</div>
              <div className="emoji">{party.emoji}</div>
              <div>candidate</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="subcontainer">
        <form onSubmit={handleSubmit}>
          {/* <ContentTypeDropdown onContentTypeChange={handleContentTypeChange} /> */}
          Your voter's information:
          <div className="personal-details">
            <div className="form-row">
              <NameOccupationLocation onNameOccupationLocationChange={handleNameOccupationLocationChange} />
              <VoteIntention onIntentionChange={handleIntentionChange}/>
            </div>
            <div>
              <AudienceDropdown onDemographicChange={handleDemographicChange} onToneChange={handleToneChange}/>
            </div>
          </div>
          {/* <AudienceDropdown onDemographicChange={handleDemographicChange} onToneChange={handleToneChange}/> */}
          <StyleArea style={style} setStyle={setStyleText} />
          <DescriptionTextArea description={description} setDescription={handleDescriptionChange} />
          <div className={`button-group ${isLoading ? 'pulse-animation' : ''}`}>
            <button
              type="submit"
              className="submit-button"
              style={{ '--button-color': partyInfo[colorIndex].color }}
            >
              <FontAwesomeIcon icon={faPenFancy} /> Write Letter
            </button>
            <button type="button" className="submit-button download-button" onClick={() => downloadPdf(prompt)} disabled={!responseText}>
              <FontAwesomeIcon icon={faDownload} /> Download Letter
            </button>
          </div>
        </form>
        <div className="response-container">
          <div className={`response-header ${isCopied ? 'copied' : ''}`} onClick={handleCopy}>
            Response
            <span className="copy-icon">
              {isCopied ? <FontAwesomeIcon icon={faCheckDouble} /> : <FontAwesomeIcon icon={faCopy} />}
            </span>
          </div>
          <div className={`response-body ${isLoading ? 'typing-animation' : ''}`}>
            {isLoading ? (
              <span key={placeholderIndex} ref={placeholderRef} className="placeholder-text">{placeholders[placeholderIndex]}</span>
            ) : (
              <ReactMarkdown className="markdown-response">{responseText || "Your personalised letter will appear here..."}</ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormComponent;
