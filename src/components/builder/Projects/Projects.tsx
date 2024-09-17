import React from "react";
import { Layout } from "antd";
import styles from "@/styles/sitebuilder.module.css";
import { ProjectsConfig } from "./ProjectsBuilder";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";  // Import useRouter

const { Content } = Layout;

interface Project {
  projectTitle: string;
  projectDescription: string;
  projectLink: string;
  isVisible: boolean;
  id: number;
}

const Projects: React.FC<{ config: ProjectsConfig }> = ({ config }) => {
  const { data: session } = useSession();
  const router = useRouter();  // Initialize the router
  const { projects, projectDisplayLayout: layout } = config;

  const visibleProjects = projects.filter((project) => project.isVisible);

  console.log("Config: ", config);

  const getContentStyle = () => {
    const path = router.pathname;

    if (path === "/") {
      return { width: "1000px" };
    } else if (path === "/site/projects") {
      return { width: "915px", marginLeft: "20vw", marginRight: "18vw" };
    } else if (path === "/site/sitedesign") {
      return { marginLeft: "25px" };
    }
    return {};
  };

  return (
    <Content style={getContentStyle()} className={styles.project}>
      <section id="Project" className={styles.projects}>
        <h2 style={{ fontFamily: config.primaryFontFamily, width: "915px" }}>Open Source Projects</h2>
        <div className={layout === "Card" ? styles.projectgrid : styles.projectList}>
          {visibleProjects.length > 0 ? (
            visibleProjects.map((project) => (
              <div key={project.id}>
                <p style={{ fontFamily: config.primaryFontFamily }}>
                  <a href={project.projectLink} target="_blank" rel="noopener noreferrer">
                    {project.projectTitle}
                  </a>
                </p>
                <p style={{ fontFamily: config.secondaryFontFamily, color: config.secondaryFontColor }}>
                  {project.projectDescription
                    ? `Description: ${project.projectDescription}`
                    : "No description found"}
                </p>
              </div>
            ))
          ) : (
            <p>No visible projects found.</p>
          )}
        </div>
      </section>
    </Content>
  );
};

export default Projects;
