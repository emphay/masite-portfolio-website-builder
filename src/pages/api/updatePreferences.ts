// pages/api/updatePreferences.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    console.log(session);

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { accentColor, backgroundColor, primaryFontColor, secondaryFontColor, primaryFontFamily, secondaryFontFamily } = req.body;

    try {
        // Ensure the user is authenticated
        if (!session) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = session.id;
        console.log(userId);

        // Check if user already has preferences
        let userPreferences = await prisma.siteDesign.findUnique({
            where: {
                userId,
            },
        });

        if (!userPreferences) {
            // Create new preferences if they don't exist
            console.log(userId, 'userId')
            userPreferences = await prisma.siteDesign.create({
                data: {
                    userId,
                    accentColor,
                    backgroundColor,
                    primaryFontColor,
                    secondaryFontColor,
                    primaryFontFamily,
                    secondaryFontFamily
                },
            });
        } else {
            // Update existing preferences
            userPreferences = await prisma.siteDesign.update({
                where: {
                    userId,
                },
                data: {
                    accentColor,
                    backgroundColor,
                    primaryFontColor,
                    secondaryFontColor,
                    primaryFontFamily,
                    secondaryFontFamily
                },
            });
        }

        res.status(200).json(userPreferences);
    }  catch (error) {
        console.error('Failed to update preferences:', error); // Log detailed error
        res.status(500).json({ message: 'Failed to update preferences', error: (error as Error).message }); // Return detailed error message
    } finally {
        await prisma.$disconnect();
    }
}
