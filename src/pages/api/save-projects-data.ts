import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ProjectReq = {
  projectTitle: string;
  projectDescription: string;
  projectLink: string;
  isVisible: boolean;
  id?: number;
};

type ProjectsConfig = {
  id: string;
  projects: ProjectReq[];
  projectDisplayLayout: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (req.method === "PUT") {
    const { id, projects, projectDisplayLayout } = req.body as ProjectsConfig;

    try {
      // Retrieve current data for comparison
      const existingProjects = await prisma.project.findMany({
        where: { userId: id },
      });

      const existingLayout = await prisma.siteDesign.findUnique({
        where: { userId: id },
        select: { projectDisplayLayout: true },
      });

      const layoutNeedsUpdate = existingLayout?.projectDisplayLayout !== projectDisplayLayout;
      const projectsChanged = JSON.stringify(projects) !== JSON.stringify(existingProjects);

      if (projectsChanged) {
        const updateQueries = projects.map((project) => {
          if (project.id) {
            return prisma.project.update({
              data: {
                projectTitle: project.projectTitle,
                projectDescription: project.projectDescription,
                projectLink: project.projectLink,
                isVisible: project.isVisible,
              },
              where: { id: project.id, userId: id },
            });
          } else {
            return prisma.project.create({
              data: {
                userId: id,
                projectTitle: project.projectTitle,
                projectDescription: project.projectDescription,
                projectLink: project.projectLink,
                isVisible: project.isVisible,
              },
            });
          }
        });

        try {
          await Promise.all(updateQueries);
          console.log("Projects updated or inserted.");
        } catch (error) {
          console.error("Error updating/inserting projects:", error);
        }
      }
      if (layoutNeedsUpdate) {
        await prisma.siteDesign.upsert({
          where: { userId: id },
          update: { projectDisplayLayout },
          create: { userId: id, projectDisplayLayout },
        });
        console.log("Display layout updated.");
      }

      res.status(200).json({ message: "Projects and/or display layout saved successfully" });
    } catch (error) {
      console.error("Error saving projects and display layout:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
