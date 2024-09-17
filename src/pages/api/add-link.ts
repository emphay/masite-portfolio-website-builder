import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Get the token from the JWT
    const token = await getToken({ req, secret });

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, url, icon } = req.body;

    if (req.method === 'POST') {
        try {
            await prisma.link.create({
                data: {
                    userId: token.id, 
                    url,
                    title,
                    icon
                }
            });
            return res.status(201).json({ message: 'Link created successfully' });
        } catch (error) {
            console.error('Error creating link:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'PUT') {
        // Handle update of existing link
        try {
            const existingLink = await prisma.link.findFirst({
                where: { userId: token.sub, title } // Use token.sub for the user ID
            });

            if (!existingLink) {
                return res.status(404).json({ error: 'Link not found' });
            }

            await prisma.link.update({
                where: { id: existingLink.id },
                data: {
                    url,
                    icon
                }
            });

            return res.status(200).json({ message: 'Link updated successfully' });
        } catch (error) {
            console.error('Error updating link:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST', 'PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
