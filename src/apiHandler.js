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

export default handleFormSubmission;
