import React, { useState, useEffect } from 'react';

function VoteIntention({ onIntentionChange }) {
  const [voterIntention, setVoterIntention] = useState('');
  const [intentionScale, setIntentionScale] = useState('');

  const showSecondDropdown = voterIntention !== 'WontSay' && voterIntention !== 'Undecided';

  useEffect(() => {
    // Format the intention string
    const intentionString = voterIntention && intentionScale
      ? `, who intends to vote ${voterIntention} with likelihood ${intentionScale}/10,`
      : '';
    // Call the callback function with the formatted intention string
    onIntentionChange(intentionString);
  }, [voterIntention, intentionScale, onIntentionChange]);


  return (
    <div>
      <div className="form-group voteintention">
        <label htmlFor="voterIntention">Vote Intention:</label>
        <select
          id="voteIntention"
          value={voterIntention}
          className="intention-dropdown"
          onChange={(e) => {
            setVoterIntention(e.target.value);
            // Reset the intention scale if hiding the second dropdown
            if (e.target.value === 'WontSay' || e.target.value === 'Undecided') {
              setIntentionScale('');
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

        {/* Scale 1-10 Dropdown */}
        {showSecondDropdown && (
          <>
            <label htmlFor="intentionScale"></label>
            <select
              id="intentionScale"
              className="intention-dropdown"
              value={intentionScale}
              onChange={(e) => setIntentionScale(e.target.value)}
            >
              <option value="">/10</option>
              {[...Array(10).keys()].map((number) => (
                <option key={number + 1} value={number + 1}>
                  {number + 1}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
    </div>
  );
}
export default VoteIntention;