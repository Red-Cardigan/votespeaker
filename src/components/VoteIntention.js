import React, { useState, useEffect } from 'react';

function VoteIntention({ onIntentionChange }) {
  const [voterIntention, setVoterIntention] = useState('');
  const [intentionScale, setIntentionScale] = useState(5);

  const showSecondDropdown = voterIntention !== 'WontSay' && voterIntention !== 'Undecided';

  // Mapping scale values to confidence words
  const confidenceWords = {
    1: 'very uncertain',
    2: 'mostly uncertain',
    3: 'somewhat uncertain',
    4: 'slightly uncertain',
    5: 'neutral',
    6: 'slightly confident',
    7: 'somewhat confident',
    8: 'mostly confident',
    9: 'very confident',
    10: 'extremely confident',
  };

  useEffect(() => {
    const confidenceWord = confidenceWords[intentionScale];
    const intentionString = voterIntention && confidenceWord
      ? `, who intends to vote ${voterIntention} with confidence: ${confidenceWord}`
      : '';
    onIntentionChange(intentionString);
  }, [voterIntention, intentionScale, onIntentionChange]);

  return (
    <div>
      <div className="form-group">
        <label htmlFor="voterIntention">Their Vote Intention:</label>
        <select
          id="voteIntention"
          value={voterIntention}
          className="intention-dropdown"
          onChange={(e) => {
            setVoterIntention(e.target.value);
            if (e.target.value === 'WontSay' || e.target.value === 'Undecided') {
              setIntentionScale(5);
            }
          }}
        >
          <option value="">Party</option>
          <option value="Labour">Labour</option>
          <option value="Conservative">Conservative</option>
          <option value="Green">Green</option>
          <option value="Reform">Reform</option>
          <option value="Libdem">Libdem</option>
          <option value="Undecided">Undecided</option>
          <option value="WontSay">Won't Say</option>
        </select>

        {showSecondDropdown && (
          <div className="intentionScale">
          <label htmlFor="intentionScale">Confidence Scale (1-10):</label>
          <input
            type="range"
            id="intentionScale"
            className="intention-slider"
            min="1"
            max="10"
            value={intentionScale}
            onChange={(e) => setIntentionScale(e.target.value)}
          />
        </div>
        )}
      </div>
    </div>
  );
}
export default VoteIntention;