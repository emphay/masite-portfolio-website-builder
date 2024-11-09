import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  

  if (req.method === "POST" || req.method === "PUT") {
    const {
      id, 
      image,
      displayName,
      title,
      description,
      instagram,
      youtube,
      github,
      linkedin,
    } = req.body;

    try {
      const result = await prisma.$transaction(async (prisma) => {
        const user = await prisma.user.update({
          where: { id: id },
          data: {
            image: image,
            displayName: displayName,
            title: title,
            description: description,
          },
        });

        const linkUpdates = [];

        const updateOrCreateLink = async (
          title: string,
          url: string,
          icon: string
        ) => {
          const existingLink = await prisma.link.findFirst({
            where: { userId: user.id, title },
          });

          if (existingLink) {
            return prisma.link.update({
              where: { id: existingLink.id },
              data: { url, icon },
            });
          } else {
            return prisma.link.create({
              data: { userId: user.id, title, url, icon },
            });
          }
        };

        linkUpdates.push(
          updateOrCreateLink("Instagram", instagram, "Instagram")
        );
        linkUpdates.push(updateOrCreateLink("YouTube", youtube, "YouTube"));
        linkUpdates.push(updateOrCreateLink("Github", github, "Github"));
        linkUpdates.push(updateOrCreateLink("LinkedIn", linkedin, "LinkedIn"));

        await Promise.all(linkUpdates);

        return user;
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error updating user profile:", error);
      return res.status(500).json({ error: "Failed to update profile" });
    }
  } else {
    res.setHeader("Allow", ["POST", "PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
