import React, { useEffect, useState, useCallback } from "react";
import { Select, Button, Segmented, Space } from "antd";
import { MenuOutlined, AppstoreOutlined } from "@ant-design/icons";

export interface ProjectReq {
  projectTitle: string;
  projectDescription: string;
  projectLink: string;
  isVisible: boolean;
  id?: number;
}

export interface ProjectsConfig {
  id: string;
  projects: ProjectReq[];
  projectDisplayLayout: string;
  githubLink: string;
  primaryFontFamily: string;
  secondaryFontFamily: string;
  secondaryFontColor: string;
  handleProjectsConfigUpdate: (conf: ProjectsConfig) => void;
}

const ProjectsBuilder: React.FC<{
  config: ProjectsConfig;
  setProjectsConfig: React.Dispatch<React.SetStateAction<ProjectsConfig | undefined>>;
  saveProjectsConfig: (projectsConfig: ProjectsConfig) => Promise<ProjectReq[]>;
}> = ({ config, setProjectsConfig, saveProjectsConfig }) => {
  const [githubRepos, setGithubRepos] = useState<ProjectReq[]>([]);
  const [selectedProjectLinks, setSelectedProjectLinks] = useState<string[]>([]);
  const [layout, setLayout] = useState<'Grid' | 'Card'>(config.projectDisplayLayout === 'Card' ? 'Card' : 'Grid');

  const extractUsernameFromLink = useCallback((link: string): string => {
    try {
      const url = new URL(link);
      return url.pathname.split('/')[1];
    } catch {
      return '';
    }
  }, []);

  const fetchGitHubRepos = useCallback(async (username: string) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      if (!response.ok) throw new Error("Failed to fetch GitHub repositories");
      const data = await response.json();

      const reposWithVisibility: ProjectReq[] = data.map((repo: any) => ({
        projectTitle: repo.name,
        projectDescription: repo.description,
        projectLink: repo.html_url,
        isVisible: config.projects.some(project => project.projectLink === repo.html_url),
      }));
      setGithubRepos(reposWithVisibility);
    } catch (error) {
      console.error("Error fetching GitHub repositories:", error);
    }
  }, [config.projects]);

  const handleChange = (selectedLinks: string[]) => {
    setSelectedProjectLinks(selectedLinks);
  };

  const fetchProjectsFromDatabase = useCallback(async () => {
    try {
      const response = await fetch("/api/getProfile");
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const data = await response.json();

      console.log("Data:", data);

      const projectsWithIds: ProjectReq[] = data.projects;
      setGithubRepos(projectsWithIds);

      setSelectedProjectLinks(
        projectsWithIds
          .filter((p) => p.isVisible)
          .map((p) => p.projectLink)
      );
    } catch (error) {
      console.error("Error fetching projects from the database:", error);
    }
  }, []);

  const handleRepos = useCallback(async () => {
    const updatedProjects = githubRepos.map((repo: ProjectReq) => ({
      ...repo,
      isVisible: selectedProjectLinks.includes(repo.projectLink),
    }));

    setProjectsConfig(prevConfig => {
      if (!prevConfig) {
        return undefined;
      }

      return {
        ...prevConfig,
        projects: updatedProjects,
        projectDisplayLayout: layout,
        githubLink: prevConfig.githubLink ?? '',
        primaryFontFamily: prevConfig.primaryFontFamily,
        secondaryFontFamily: prevConfig.secondaryFontFamily,
        secondaryFontColor: prevConfig.secondaryFontColor,
        handleProjectsConfigUpdate: prevConfig.handleProjectsConfigUpdate,
      };
    });

    const savedProjects = await saveProjectsConfig({
      id: config.id,
      projects: updatedProjects,
      projectDisplayLayout: layout,
      githubLink: config.githubLink,
      primaryFontFamily: config.primaryFontFamily,
      secondaryFontFamily: config.secondaryFontFamily,
      secondaryFontColor: config.secondaryFontColor,
      handleProjectsConfigUpdate: config.handleProjectsConfigUpdate,
    });

    await fetchProjectsFromDatabase();
  }, [githubRepos, selectedProjectLinks, layout, setProjectsConfig, saveProjectsConfig, config, fetchProjectsFromDatabase]);

  useEffect(() => {
    if (config.projects?.length > 0) {
      setGithubRepos(config.projects);
      setSelectedProjectLinks(config.projects.filter(project => project.isVisible).map(project => project.projectLink));
    } else if (config.githubLink) {
      const username = extractUsernameFromLink(config.githubLink);
      if (username) fetchGitHubRepos(username);
    }
  }, [config, extractUsernameFromLink, fetchGitHubRepos]);

  const handleLayoutChange = useCallback((value: 'Grid' | 'Card') => {
    setLayout(value);

    setProjectsConfig(prevConfig => {
      if (!prevConfig) {
        return undefined;
      }

      return {
        ...prevConfig,
        projectDisplayLayout: value,
        projects: prevConfig.projects ?? [],
        githubLink: prevConfig.githubLink ?? '',
        primaryFontFamily: prevConfig.primaryFontFamily,
        secondaryFontFamily: prevConfig.secondaryFontFamily,
        secondaryFontColor: prevConfig.secondaryFontColor,
        handleProjectsConfigUpdate: prevConfig.handleProjectsConfigUpdate,
      };
    });

    saveProjectsConfig({
      id: config.id,
      projects: githubRepos.map(repo => ({
        ...repo,
        isVisible: selectedProjectLinks.includes(repo.projectLink),
      })),
      projectDisplayLayout: value,
      githubLink: config.githubLink,
      primaryFontFamily: config.primaryFontFamily,
      secondaryFontFamily: config.secondaryFontFamily,
      secondaryFontColor: config.secondaryFontColor,
      handleProjectsConfigUpdate: config.handleProjectsConfigUpdate,
    });
  }, [githubRepos, selectedProjectLinks, setProjectsConfig, saveProjectsConfig, config]);

  const selectOptions = githubRepos
    .sort((a, b) => (a.id ?? 0) - (b.id ?? 0)) // Sort by id in ascending order
    .map(repo => ({
      label: (
        <Space>
          <span>{repo.projectTitle}</span>
        </Space>
      ),
      value: repo.projectLink,
    }));

  return (
    <div
      style={{
        background: "white",
        width: "18vw",
        minWidth: "200px",
        padding: "20px",
        height: "100vh",
        overflowY: "auto",
        scrollBehavior: "smooth",
        position: "fixed",
        right: "0",
      }}
    >
      <h2 style={{ fontSize: "20px" }}>Projects</h2>
      <div style={{ border: "1px solid #eee", padding: "10px" }}>
        <h3>GitHub Repos</h3>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Select projects"
          value={selectedProjectLinks}
          onChange={handleChange}
          options={selectOptions}
        />
      </div>
      <div style={{ border: "1px solid #eee", padding: "20px", marginTop: "30px" }}>
        <h3>Design</h3>
        <p>Display Layout</p>
        <Segmented
          options={[
            { label: <><MenuOutlined /> Grid</>, value: "Grid" },
            { label: <><AppstoreOutlined /> Card</>, value: "Card" },
          ]}
          value={layout}
          onChange={handleLayoutChange}
          style={{ border: "none", fontSize: "13px" }}
        />
      </div>
      <div>
        <Button
          type="primary"
          onClick={handleRepos}
          style={{
            backgroundColor: "#3BAFDE",
            borderColor: "#3BAFDE",
            color: "white",
            marginTop: "20px",
          }}
        >
          Update Preferences
        </Button>
      </div>
    </div>
  );
};

export default ProjectsBuilder;
