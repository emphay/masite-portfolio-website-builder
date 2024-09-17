import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'POST') {
        const { FirstName, LastName, imageUrl, displayName, title, description } = req.body;

        try {
            const user = await prisma.user.update({
                where: { email: session?.user?.email || "" },
                data: {
                    FirstName: FirstName,
                    LastName: LastName,
                    image: imageUrl,
                    displayName: displayName,
                    title: title,
                    description: description
                },
            });
            console.log(session.user?.email);
            return res.status(200).json(user);
        } catch (error) {
            console.error('Error updating user profile:', error);
            return res.status(500).json({ error: 'Failed to update profile' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
