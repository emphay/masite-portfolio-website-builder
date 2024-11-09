import React, { useEffect, useState } from "react";
import ProjectsBuilder, { ProjectReq, ProjectsConfig } from "@/components/builder/Projects/ProjectsBuilder";
import { useSession } from "next-auth/react";
import SiteBuilderLayout from "@/components/Layouts/SiteBuilderLayout";
import Projects from "@/components/builder/Projects/Projects";
import { Spin } from "antd";

const ProjectsPage: React.FC = () => {
  const { data: session } = useSession();
  const [projectsData, setProjectsData] = useState<ProjectsConfig | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const response = await fetch("/api/getProfile");
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();

        //  console.log("Data:", data);
        setLoading(false);
        const siteDesign = data.SiteDesign && data.SiteDesign.length > 0 ? data.SiteDesign[0] : {};
        const githubLink = data.links.find((link: any) => link.title === "Github")?.url || "";

        const proj = {
          id: data.id,
          projectDisplayLayout: siteDesign.projectDisplayLayout || "card",
          githubLink: githubLink,
          primaryFontFamily: siteDesign.primaryFontFamily,
          secondaryFontColor: siteDesign.secondaryFontColor,
          secondaryFontFamily: siteDesign.secondaryFontFamily,
          projects: data.projects.map((project: any) => ({
            id: project.id,
            projectTitle: project.projectTitle,
            projectDescription: project.projectDescription,
            projectLink: project.projectLink,
            isVisible: project.isVisible,
          })),
          handleProjectsConfigUpdate: (newConfig: ProjectsConfig) => setProjectsData(newConfig), // Include this method
        };

        // console.log("Hello World: ", proj);
        setProjectsData(proj);

      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProjectsData();
  }, []);

  const saveProjectsConfig = async (projectsConfig: ProjectsConfig): Promise<ProjectReq[]> => {
    try {
      const { id, projects, projectDisplayLayout } = projectsConfig;

      console.log('The Projects are: ', projects);
      console.log('Project Display Layout: ', projectDisplayLayout);

      const dataToSend = {
        id,
        projects,
        projectDisplayLayout,
      };

      const response = await fetch("/api/save-projects-data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile data");
      }

      const result: ProjectReq[] = await response.json();
      console.log("Profile saved successfully:", result);
      return result;
    } catch (error) {
      console.error("Error saving profile data:", error);
      throw error;
    }
  };


  return (
    <SiteBuilderLayout>
      {loading && (<Spin
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      />)}
      {!loading && projectsData && (<>
        <Projects config={projectsData} />
        <ProjectsBuilder
          config={projectsData}
          setProjectsConfig={setProjectsData}
          saveProjectsConfig={saveProjectsConfig}
        /></>)}
    </SiteBuilderLayout>
  );
};

export default ProjectsPage;
