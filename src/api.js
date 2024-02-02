import OpenAI from "openai";

// const API_KEY = process.env.REACT_APP_OPENAI_API_KEY; // Ensure you have your API key set in your environment variables
// const API_URL = 'https://api.openai.com/v1/chat/completions';
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true
});

const generateTextCopy = async (prompt) => {
  try {
    // Ensure the messages parameter is structured correctly
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log(completion.choices[0].message.content);
    return completion.choices[0].message.content;

  } catch (error) {
    console.error('Error generating text:', error);
  }
};

export default generateTextCopy;
