import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        const { title } = req.query;

        try {
            const link = await prisma.link.findMany({
                where: { userId: session.id },
                select: {
                    url: true,
                    title: true,
                    icon: true
                }
            });

            if (!link) {
                return res.status(404).json({ error: 'Link not found' });
            }

            return res.status(200).json(link);
        } catch (error) {
            console.error('Error fetching link:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
