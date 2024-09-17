import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { presentationTitle, presentationLink, presentationDescription, dateOfPresentation } = req.body;
  const token = await getToken({ req, secret });

  if(token)
    {
      await prisma.presentation.create({
        data: {
          userId: token?.id,
          presentationDescription: presentationDescription,
          presentationTitle: presentationTitle,
          presentationLink: presentationLink,
          dateOfPresentation: new Date(dateOfPresentation),
        }
      })
    }
  res.redirect('/');
}
