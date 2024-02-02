import { Pool } from 'pg';
import OpenAI from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  generatedText: string;
}

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const pool = new Pool({
    connectionString: process.env.HEROKU_POSTGRESQL_AQUA_URL,
    ssl: { rejectUnauthorized: false }
  });

if (!process.env.REACT_APP_OPENAI_API_KEY) {
    console.error('Missing environment variables');
    process.exit(1);
  }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OpenAIResponse | ErrorResponse | SuccessResponse>
): Promise<void> {

  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json({ error: 'No prompt provided' });
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }) as OpenAIResponse;

    const generatedText = completion.choices[0].message.content;

    await pool.query(
      'INSERT INTO votespeaker(prompt, response, created_at) VALUES($1, $2, NOW())',
      [prompt, generatedText]
    );

    res.status(200).json({ generatedText });
  } catch (error) {
    console.error('Error generating text:', error);
    res.status(500).json({ error: 'Failed to generate text' });
  }
}