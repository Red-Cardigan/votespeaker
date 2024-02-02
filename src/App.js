import React from 'react';
import './index.css';
import FormComponent from './components/FormComponent';

function App() {
  return (
    <div className="App">
      <div className="page-header">
        <h1>VoteSpeaker AI</h1>
        <a href="https://www.campaignlab.uk/" target="_blank" rel="noopener noreferrer">A CampaignLab Project</a>
      </div>
      <header className="App-header">
        <div className="text-container">
          <h1 className="title-text">Draft messages to bring voters over to your side.</h1>
          <p className="description-text"></p>
        </div>
      </header>
      <main>
        <FormComponent />
      </main>
      <footer className="page-footer">
        <a href="https://www.campaignlab.uk/">© 2023 VoteSpeaker - A CampaignLab Project</a>
      </footer>
    </div>
  );
}

export default App;
