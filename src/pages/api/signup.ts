/**
 * Create an API to signup a user, that takes email, username & password and saves in the table UserAccount
 * POST API { email: abc@mail.com, username: u123, password: ****}
 */

import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

//@ts-ignore
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { username, email, password } = req.body;
    const saltRounds = 10;
    //hash the password
    bcrypt.hash(password, saltRounds, async (err: any, hash: any) => {
        await prisma.user.create({
            data: {
                FirstName: username,
                LastName: username,
                username: username,
                email: email,
                password: hash
            }
        })
    })

    res.redirect('/signin');

}


