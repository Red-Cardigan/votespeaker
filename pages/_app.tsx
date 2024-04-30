import React, { useState } from 'react';
import FormComponent from '../src/components/FormComponent';
import '../styles/index.css'; // Adjust the path based on your structure
import { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [showPolicy, setShowPolicy] = useState(false);

  return (
    <div className="App">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1>VoteSpeaker AI</h1>
          <div className="link-container">
            <a href="https://www.wyza.uk" target="_blank" rel="noopener noreferrer" style={{ fontSize: 'small' }}>from Wyza</a>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <a href="https://www.campaignlab.uk/" target="_blank" rel="noopener noreferrer" style={{ textAlign: 'right' }}>Incubated by CampaignLab</a>
          <div>
            <span className="policy-disclaimer" onClick={() => setShowPolicy(!showPolicy)}>Policy Disclaimer</span>
          </div>
        </div>
      </div>
      {showPolicy && (
        <div className="policy-popup">
        <p><strong>Remember:</strong> this is a demo to demonstrate how AI can be used to produce campaign content.</p>
        <p><strong>Do not</strong> disclose any sensitive material, such as individual information, strategy documents, or sensitive personal data, to Votespeaker. It is crucial to remember that you are responsible for protecting the data you manage. Please abide by your existing Data protection policy when you are using Votespeaker. If you are interested in using this tool beyond demo purposes in a way complies with data protection contact Wyza data.</p>
        <p><strong>Do</strong> remember that when using AI tools, you are ultimately responsible for the final output. You should therefore verify any factual claims, check for logical and grammatical errors, and ensure that the content adheres to your organisation's standards and values.</p>
        <p><strong>Do not</strong> use AI to generate fake or harmful information.</p>
        <p><strong>Do</strong> make sure all and any campaign materials that will be received by people are authored by a human being.</p>
        <p><strong>Do</strong> be mindful that many AI model policies forbid the large scale use of these models for political purposes.</p>
        <button className="policy-close-button" onClick={() => setShowPolicy(false)}>Acknowledge</button>
      </div>
      )}
      <header className="App-header">
        <div className="text-container">
          <h1 className="title-text">Draft letters to sway voters and bolster support.</h1>
          <p className="description-text">Enter a hypothetical voter's details below, then click 'Write Letter' to generate a personalised campaign letter.</p>
        </div>
      </header>
      <main>
        <Component {...pageProps} />
        <FormComponent />
      </main>
      <footer className="page-footer">
        <div>Can I use my own database to write personalised letters like this to thousands of constituents?</div>   
        <div><a href="https://www.wyza.uk/"> Yes. Find Out More</a></div>
      </footer>
    </div>
  );
}
