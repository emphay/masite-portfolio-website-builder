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
    console.log("The User ID is ", id);
    console.log('The Projects: ', projects);
    console.log('Project Display Layout: ', projectDisplayLayout);

    try {
      if (projects.filter(p => p.id).length === projects.length) {
        const updateQueries = projects.map(project => {
          return prisma.project.update({
            data: {
              projectTitle: project.projectTitle,
              projectDescription: project.projectDescription,
              projectLink: project.projectLink,
              isVisible: project.isVisible,
            },
            where: {
              id: project.id,
              userId: id
            },
          });
        });
      
        try {
          const updateResults = await Promise.all(updateQueries);
          console.log("Updated Projects: ", updateResults);
        } catch (error) {
          console.error("Error updating projects: ", error);
        }
      } else {
        const insertQueries = projects.map(project => {
          return prisma.project.create({
            data: {
              userId: id, 
              id: project.id,
              projectTitle: project.projectTitle,
              projectDescription: project.projectDescription,
              projectLink: project.projectLink,
              isVisible: project.isVisible,
            },
          });
        });
      
        try {
          const insertResults = await Promise.all(insertQueries);
          console.log("Inserted Projects: ", insertResults);
        } catch (error) {
          console.error("Error inserting projects: ", error);
        }
      }
      
      await prisma.siteDesign.upsert({
        where: { userId: id },
        update: { projectDisplayLayout: projectDisplayLayout },
        create: {
          userId: id,
          projectDisplayLayout: projectDisplayLayout
        }
      });

      res.status(200).json({ message: 'Projects and display layout saved successfully' });
    } catch (error) {
      console.error('Error saving projects and display layout:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}