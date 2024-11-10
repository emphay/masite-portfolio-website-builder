import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST' && req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const {
        firstName, lastName, aboutText, contactType, contactValue, articleText, projectText, presentationText
    } = req.body;

    const navigationLinks = [
        { title: aboutText, url: '#about', icon: '' },
        { title: articleText, url: '#articles', icon: '' },
        { title: projectText, url: '#projects', icon: '' },
        { title: presentationText, url: '#presentations', icon: '' },
        { title: contactType, url: contactValue, icon: 'Contacts' },
    ];

    console.log('Request Body:', req.body);
    const userId = req.body.id; 

    try {
        await prisma.$transaction(async (prisma) => {
            // Update or create user profile
            const userExists = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (userExists) {
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        FirstName: firstName,
                        LastName: lastName,
                    },
                });
            } else {
                await prisma.user.create({
                    data: {
                        id: userId,
                        FirstName: firstName,
                        LastName: lastName,
                    },
                });
            }

            // Handle link operations
            const linkOperations = navigationLinks.map(async (link) => {
                if (req.method === 'POST') {
                    if (link.icon === 'Contacts') {
                        // Remove existing contacts links
                        await prisma.link.deleteMany({
                            where: {
                                userId,
                                icon: 'Contacts',
                            },
                        });
                    }
                    return prisma.link.create({
                        data: {
                            userId,
                            url: link.url,
                            title: link.title,
                            icon: link.icon || '', // Ensure icon is empty if not specified
                        },
                    });
                } else if (req.method === 'PUT') {
                    if (link.icon === 'Contacts') {
                        await prisma.link.deleteMany({
                            where: {
                                userId,
                                icon: 'Contacts',
                            },
                        });
                    }
                    const existingLink = await prisma.link.findFirst({
                        where: { userId, url: link.url },
                    });

                    if (existingLink) {
                        return prisma.link.update({
                            where: { id: existingLink.id },
                            data: {
                                title: link.title,
                                icon: link.icon || '', 
                            },
                        });
                    } else {
                        return prisma.link.create({
                            data: {
                                userId,
                                url: link.url,
                                title: link.title,
                                icon: link.icon || '', 
                            },
                        });
                    }
                }
            });

            await Promise.all(linkOperations);

            res.status(200).json({ message: 'Navigation Data updated successfully' });
        });
    } catch (error) {
        console.error('Error updating profile and links:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
