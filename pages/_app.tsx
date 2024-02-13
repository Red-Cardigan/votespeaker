import React from 'react';
import FormComponent from '../src/components/FormComponent';
import '../styles/index.css'; // Adjust the path based on your structure
import { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="App">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1>VoteSpeaker AI</h1>
          <div className="link-container">
            <a href="https://www.wyza.uk" target="_blank" rel="noopener noreferrer" style={{ fontSize: 'small' }}>from Wyza</a>
          </div>
        </div>
        <a href="https://www.campaignlab.uk/" target="_blank" rel="noopener noreferrer" style={{ textAlign: 'right' }}>Incubated by CampaignLab</a>
      </div>
      <header className="App-header">
        <div className="text-container">
          <h1 className="title-text">Draft messages to sway voters and bolster support.</h1>
          <p className="description-text"></p>
        </div>
      </header>
      <main>
        <Component {...pageProps} />
        <FormComponent />
      </main>
      <footer className="page-footer">Want to scale this up to your whole constituency?   
        <a href="https://www.wyza.uk/" style={{ marginLeft: '10px'}}>    Get in touch</a>
      </footer>
    </div>
  );
}
