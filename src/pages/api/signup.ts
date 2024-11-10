import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

//@ts-ignore
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { username, email, password } = req.body;
    const saltRounds = 10;

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        });

        if (existingUser) {
            return res.status(264).json({ message: 'Email or username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the new user
        await prisma.user.create({
            data: {
                FirstName: username, 
                LastName: username,  
                username: username,
                email: email,
                password: hashedPassword,
            }
        });
        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}
