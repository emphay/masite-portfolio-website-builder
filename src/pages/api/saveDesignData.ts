import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, accentColor, backgroundColor, primaryFontColor, secondaryFontColor, primaryFontFamily, secondaryFontFamily } = req.body;
  const userId= req.body.id;

    if (req.method === "POST") {
    try {
      let siteDesign = await prisma.siteDesign.findUnique({
        where: { userId },
      });

      if (!siteDesign) {
        siteDesign = await prisma.siteDesign.create({
          data: {
            userId,
            accentColor,
            backgroundColor,
            primaryFontColor,
            secondaryFontColor,
            primaryFontFamily,
            secondaryFontFamily,
          },
        });
      } else {
        siteDesign = await prisma.siteDesign.update({
          where: { userId },
          data: {
            accentColor,
            backgroundColor,
            primaryFontColor,
            secondaryFontColor,
            primaryFontFamily,
            secondaryFontFamily,
          },
        });
      }

      res.status(200).json(siteDesign);
    } catch (error) {
      console.error('Error saving design configuration:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
