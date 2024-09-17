import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const {
    id, 
    presentationDisplayLayout,
    presentationThumbnail,
    presentationTitle,
    presentationLink,
    presentationDescription,
    dateOfPresentation
  } = req.body;

  if (req.method === "POST" || req.method === "PUT") {

    try {
      const result = await prisma.$transaction(async (prisma) => {
        const user = await prisma.siteDesign.update({
          where: { userId: id },
          data: {
            presentationDisplayLayout,
            presentationThumbnail
          },
        });

        const existingLink = await prisma.presentation.findFirst({
          where: { userId: id, presentationLink },
        });

        if (existingLink) {
          return prisma.presentation.update({
            where: { id: existingLink.id },
            data: {
              presentationTitle,
              presentationLink,
              dateOfPresentation,
              presentationDescription
            },
          });
        } else {
          return prisma.presentation.create({
            data: {
              userId: id,
              presentationTitle,
              presentationLink,
              dateOfPresentation,
              presentationDescription
            },
          });
        }
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error updating user profile:", error);
      return res.status(500).json({ error: "Failed to update profile" });
    } 
  } else if (req.method === "DELETE") {
    const { presentationLink } = req.body;

    if (!presentationLink) {
      return res.status(400).json({ error: "Presentation link is required" });
    }

    try {
      const presentation = await prisma.presentation.findFirst({
        where: { userId: id, presentationLink },
      });

      if (!presentation) {
        return res.status(404).json({ error: "Presentation not found" });
      }

      await prisma.presentation.delete({
        where: { id: presentation.id },
      });

      return res.status(200).json({ message: "Presentation deleted successfully" });
    } catch (error) {
      console.error("Error deleting presentation:", error);
      return res.status(500).json({ error: "Failed to delete presentation" });
    } 
  }
  else {
    res.setHeader("Allow", ["POST", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
