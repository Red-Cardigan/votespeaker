import axios from 'axios';

const handleFormSubmission = async (prompt) => {
  const response = await fetch('/api/generateText', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};


// import generateTextCopy from './api';

// const handleFormSubmission = async (prompt) => {
//   try {
//     // Call the generateTextCopy function from api.js with the complete prompt
//     const generatedText = await generateTextCopy(prompt);

//     // Return the generated text to be displayed to the user
//     return generatedText;
//   } catch (error) {
//     console.error('Error handling form submission:', error);
//     throw error;
//   }
// };

export default handleFormSubmission;
