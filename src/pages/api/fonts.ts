import { NextApiRequest, NextApiResponse } from 'next';
import { getFonts } from 'font-list';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const fonts = await getFonts();

    res.status(200).json({ fonts });
  } catch (err) {
    console.error('Error fetching fonts:', err);
    res.status(500).json({ error: 'Failed to fetch fonts' });
  }
}
