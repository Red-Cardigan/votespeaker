import type { NextApiRequest, NextApiResponse } from 'next';

// Assuming `jobs` is accessible here, possibly through a database or shared state
const jobs = new Map();

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): void {
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