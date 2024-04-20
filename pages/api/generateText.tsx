import { Pool } from 'pg';
import OpenAI from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  generatedText: string;
}

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const pool = process.env.NODE_ENV !== 'development' ? new Pool({
  connectionString: process.env.HEROKU_POSTGRESQL_AQUA_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
}) : null;

if (!process.env.REACT_APP_OPENAI_API_KEY || !process.env.ASSISTANT_ID) {
    console.error('Missing environment variables');
    process.exit(1);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | SuccessResponse>
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
    // Create a new thread for the request
    const thread = await openai.beta.threads.create();
    const run = await openai.beta.threads.runs.createAndPoll(
      thread.id,
      { 
        instructions: prompt,
        assistant_id: process.env.ASSISTANT_ID,
      }
    );

    // Check if the run completed successfully
    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      const generatedText = messages.data
      .reverse()
      .map(message => {
        // Assuming each message has a content array with at least one item
        const firstContentBlock = message.content[0];
        // Check if the content block is of type that includes text
        if ('text' in firstContentBlock) {
          return firstContentBlock.text.value;
        }
        return ''; // Return an empty string or some default value for non-text content blocks
      })
      .join('\n');

      if (process.env.NODE_ENV !== 'development' && pool) {
        await pool.query(
          'INSERT INTO votespeaker(prompt, response, created_at) VALUES($1, $2, NOW())',
          [prompt, generatedText]
        );
      }

      res.status(200).json({ generatedText });
    } else {
      console.log(run.status);
      res.status(500).json({ error: 'Failed to generate text due to run status: ' + run.status });
    }
  } catch (error) {
    console.error('Error generating text:', error);
    res.status(500).json({ error: 'Failed to generate text' });
  }
}