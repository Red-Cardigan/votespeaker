import generateTextCopy from './api';

const handleFormSubmission = async (prompt) => {
  try {
    // Call the generateTextCopy function from api.js with the complete prompt
    const generatedText = await generateTextCopy(prompt);

    // Return the generated text to be displayed to the user
    return generatedText;
  } catch (error) {
    console.error('Error handling form submission:', error);
    throw error;
  }
};

export default handleFormSubmission;
