import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

type Data = {
  total?: number;
  updated?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'donation-total.json');
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContents);

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Could not read donation total' });
  }
}

/*

OLD ONE - FETCHES EVERY TIME PAGE LOADS, STOPPED WORKING DUE TO VERCEL SECURITY

import type { NextApiRequest, NextApiResponse } from 'next';

// Define the response type for better type safety
type Data = {
  total?: number;
  error?: string;
};

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<Data>
) {
  try {
    const url = "https://givestar.io/gs/alfie-rayner";
    
    const response = await fetch(url, {
      next: { revalidate: 60 } 
    });
    
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to fetch page: ${response.status} ${response.statusText} - ${body}`);
    }
    
    const html = await response.text();
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    
    if (!nextDataMatch) {
      return res.status(500).json({ error: 'Data tag not found' });
    }

    const jsonString = nextDataMatch[1];
    const donationMatches = [...jsonString.matchAll(/"donationTotal":\s*([0-9.]+)/g)];

    if (donationMatches.length === 0) {
      return res.status(500).json({ error: 'donationTotal key not found in JSON' });
    }

    const lastMatch = donationMatches[donationMatches.length - 1];
    const donationTotal = lastMatch[1];

    return res.status(200).json({ total: Number(donationTotal) || 0 });
    
  } catch (error: unknown) {
    // Check if the error is an instance of the Error object
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
}*/