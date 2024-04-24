const handleFormSubmission = (prompt, onMessageCallback) => {
  // Construct the URL with the prompt as a query parameter
  const url = new URL('/api/generateText', window.location.origin);
  url.searchParams.append('prompt', prompt);

  // Initialize a new EventSource connection
  const eventSource = new EventSource(url);

  eventSource.onmessage = function(event) {
    // Parse the incoming message as JSON
    const data = JSON.parse(event.data);

    // Log the received chunk
    console.log(data);

    // Call the callback function with the received data
    onMessageCallback(data);
  };

  eventSource.onerror = function(error) {
    console.error('EventSource failed:', error);
    eventSource.close();
    // Handle the error, e.g., by calling the callback with an error message
    onMessageCallback({ error: 'Failed to receive streamed response' });
  };

  // Return the eventSource to allow manual closing of the connection if needed
  return eventSource;
};

export default handleFormSubmission;