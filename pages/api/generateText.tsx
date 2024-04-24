import { Pool } from 'pg';
import OpenAI from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Transform } from 'stream';

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
  if (req.method !== 'GET') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { prompt } = req.query;

  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'No prompt provided' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const thread = await openai.beta.threads.create();

    const runStream = openai.beta.threads.runs.stream(thread.id, {
      instructions: prompt,
      assistant_id: process.env.ASSISTANT_ID,
    });

    runStream
      .on('textCreated', (text) => {
        // Send each piece of text as a separate SSE event
        res.write(`data: ${JSON.stringify({ generatedText: text.value })}\n\n`);
        console.log(text.value);
      })
      .on('textDelta', (textDelta) => {
        // Optionally handle deltas; for simplicity, you might skip this
      })
      .on('end', () => {
        // Close the connection once the stream ends
        res.end();
      })
      .on('error', (error) => {
        console.error('Error generating text:', error);
        // It's tricky to send an error once headers are sent in SSE, so consider logging or other strategies
        res.end();
      });

  } catch (error) {
    console.error('Error setting up text generation:', error);
    // Sending errors is difficult once streaming has started, so ensure error handling is robust before this point
    res.end();
  }
}