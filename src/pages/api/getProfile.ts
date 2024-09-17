import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findFirst({
        select: {
          id: true,
          FirstName: true,
          LastName: true,
          username: true,
          email: true,
          image: true,
          displayName: true,
          title: true,
          description: true,
          links: true,
          projects: true,
          presentations: true,
          SiteDesign: true,
          ArticleConfig: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
