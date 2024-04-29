import OpenAI from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

const jobs = new Map();

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

interface JobSubmissionResponse {
  jobId: string;
}

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

if (!process.env.REACT_APP_OPENAI_API_KEY) {
    console.error('Missing environment variables');
    process.exit(1);
  }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OpenAIResponse | ErrorResponse | SuccessResponse | JobSubmissionResponse>
): Promise<void> {
  if (req.method === 'POST') {
    return handleGenerateText(req, res);
  } else if (req.method === 'GET') {
    return handleCheckStatus(req, res);
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end('Method Not Allowed');
  }
}

async function handleGenerateText(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json({ error: 'No prompt provided' });
    return;
  }
  const jobId = uuidv4();
  jobs.set(jobId, { status: 'pending', result: null });

  // Simulate background processing
  processInBackground(prompt, jobId);

  res.status(202).json({ jobId });

  async function processInBackground(prompt: string, jobId: string) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }) as OpenAIResponse;

      const generatedText = completion.choices[0].message.content;
      jobs.set(jobId, { status: 'completed', result: generatedText });
      res.status(200).json({ generatedText });
    } catch (error) {
      jobs.set(jobId, { status: 'failed', result: null });
      console.error('Error generating text:', error);
      res.status(500).json({ error: 'Failed to generate text' });
    }
  }
}

function handleCheckStatus(req: NextApiRequest, res: NextApiResponse) {
  const { jobId } = req.query;

  if (!jobId) {
    res.status(400).json({ error: 'Job ID is required' });
    return;
  }

  const job = jobs.get(jobId);

  if (!job) {
    res.status(404).json({ error: 'Job not found' });
    return;
  }

  res.status(200).json(job);
}