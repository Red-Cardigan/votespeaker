// Define handleFormSubmission
const handleFormSubmission = async (prompt) => {
  const response = await fetch('/api/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

// Define checkJobStatus
async function checkJobStatus(jobId) {
  const response = await fetch(`/api/api?jobId=${jobId}`);
  if (!response.ok) {
    throw new Error('Failed to check job status');
  }
  return response.json();
}

// Define monitorJobStatus
async function monitorJobStatus(prompt) {
  try {
    const { jobId } = await handleFormSubmission(prompt);
    let jobStatus = await checkJobStatus(jobId);

    while (jobStatus.status === 'pending') {
      await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds
      jobStatus = await checkJobStatus(jobId);
    }

    if (jobStatus.status === 'completed') {
      return jobStatus.result; // Optionally return the result for further processing
    } else {
      console.error('Job failed');
      throw new Error('Job processing failed');
    }
  } catch (error) {
    console.error('Error:', error.message);
    throw error; // Rethrow the error for handling by the caller
  }
}

// Export functions as needed
export { handleFormSubmission, monitorJobStatus, checkJobStatus };