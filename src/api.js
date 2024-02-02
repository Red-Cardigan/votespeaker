import OpenAI from "openai";

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

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

    const response = completion.choices[0].message.content;

  // Insert prompt and response into the database
  await pool.query(
    'INSERT INTO prompts_responses(prompt, response, created_at) VALUES($1, $2, NOW())',
    [prompt, response]
  );

  return response;

} catch (error) {
  console.error('Error generating text or inserting into database:', error);
}
};

export default generateTextCopy;
