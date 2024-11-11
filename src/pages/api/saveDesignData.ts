import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  // If there's no session, the user is unauthorized.
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.id;

  // Destructure the necessary properties from the request body.
  const { accentColor, backgroundColor, primaryFontColor, secondaryFontColor, primaryFontFamily, secondaryFontFamily } = req.body;

  // Check if all necessary properties are present
  if (!accentColor || !backgroundColor || !primaryFontColor || !secondaryFontColor || !primaryFontFamily || !secondaryFontFamily) {
    return res.status(400).json({ error: "Missing required fields" });
  }

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
      console.error("Error saving design configuration:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
