import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { projectTitle, projectDescription, projectLink, isVisible } = req.body;
  const token = await getToken({ req, secret });

  if(token)
    {
      await prisma.project.create({
        data: {
          userId: token.id,
          projectTitle: projectTitle,
          projectDescription: projectDescription || null,
          projectLink: projectLink,
          isVisible: isVisible
        }
      })
    }
  res.redirect('/');
}
