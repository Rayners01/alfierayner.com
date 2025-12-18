import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    // Instead of parsing and recursing (which stops at the first match),
    // we search the string for all instances of "donationTotal"
    const jsonString = nextDataMatch[1];
    
    // This regex looks for "donationTotal": followed by numbers
    const donationMatches = [...jsonString.matchAll(/"donationTotal":\s*([0-9.]+)/g)];

    if (donationMatches.length === 0) {
      return res.status(500).json({ error: 'donationTotal key not found in JSON' });
    }

    // Replicate "tail -n 1" by taking the very last match found in the data
    const lastMatch = donationMatches[donationMatches.length - 1];
    const donationTotal = lastMatch[1];

    return res.status(200).json({ total: Number(donationTotal) || 0 });
    
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}