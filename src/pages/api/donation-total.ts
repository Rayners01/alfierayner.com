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
    
    if (!response.ok) throw new Error('Failed to fetch page');
    
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
}