import React from "react";
import { useSession } from "next-auth/react";
import SiteBuilderLayout from "@/components/Layouts/SiteBuilderLayout";
import Nav from "@/components/builder/Nav/Navigation";
import { PhoneOutlined } from "@ant-design/icons";
import About from "@/components/builder/About/About";
import Articles from "@/components/builder/Articles/Articles";
import Projects from "@/components/builder/Projects/Projects";
import { NavConfig } from "@/components/builder/Nav/NavBuilder";
import { AboutConfig } from "@/components/builder/About/AboutBuilder";
import { ArticlesConfig } from "@/components/builder/Articles/ArticlesBuilder";
import { ProjectsConfig } from "@/components/builder/Projects/ProjectsBuilder";
import { SiteDesignConfig } from "./SitedesignBuilder";
import styles from "@/styles/sitebuilder.module.css";
import { Button, Space } from "antd";
import Presentations from "../Presentations/Presentation";
import { PresentationConfig } from "../Presentations/PresentationsBuilder";
import { MailOutlined, WhatsAppOutlined } from "@ant-design/icons";
import {
  GithubOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
  InstagramOutlined,
} from "@ant-design/icons";

interface SiteDesignPageProps {
  navData: NavConfig;
  designData: SiteDesignConfig;
  projectsData: ProjectsConfig;
  aboutData: AboutConfig;
  articlesData: ArticlesConfig;
  presentationData: PresentationConfig;
}

const contactIconMapping: Record<string, React.ReactNode> = {
  WhatsApp: <WhatsAppOutlined />,
  Telegram: (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15">
      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m14.5 1.5l-14 5l4 2l6-4l-4 5l6 4z" />
    </svg>
  ),
  Email: <MailOutlined />,
  Phone: <PhoneOutlined />,
};

const contactValueMapping: Record<string, string> = {
  WhatsApp: "https://wa.me/",
  Telegram: "https://t.me/",
  Email: "mailto:",
  Phone: "tel:",
};

const SiteDesignPage: React.FC<SiteDesignPageProps> = ({
  navData,
  designData,
  projectsData,
  aboutData,
  articlesData,
  presentationData
}) => {
  const { data: session } = useSession();
  const contactIcon = contactIconMapping[navData.contactType] || null;
  const contactUrlPrefix = contactValueMapping[navData.contactType] || "";
  const contactValue = `${contactUrlPrefix}${navData.contactValue}`;

  return (
    <div style={{ width: "915px", backgroundColor: designData.backgroundColor, margin: "auto" }}>
      <header className={styles.header}>
        <nav className={styles.topnav}>
          <div className={styles.hamburger}>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <h1 className={styles.siteTitle}>
            <span
              style={{
                color: designData.primaryFontColor,
                fontFamily: designData.primaryFontFamily,
              }}
            >
              {navData.firstName.toUpperCase()} {navData.lastName.toUpperCase()}
            </span>
          </h1>
          <ul
            className={styles.navList}
            style={{
              color: designData.secondaryFontColor,
              fontFamily: designData.secondaryFontFamily,
            }}
          >
            <li>
              <a href="#About">{navData.aboutText}</a>
            </li>
            <li>
              <a href="#Article">{navData.articleText}</a>
            </li>
            <li>
              <a href="#Project">{navData.projectText}</a>
            </li>
            <li>
              <a href="#Presentations">{navData.presentationText}</a>
            </li>
          </ul>
          <Button
            className={styles.customButton}
            icon={contactIcon}
            href={contactValue}
            style={{
              backgroundColor: designData.accentColor,
              borderColor: designData.accentColor,
            }}
          >
            {navData.contactType}
          </Button>
        </nav>
      </header>
      <section id="About" className={styles.home}>
        <div
          style={{
            height: "160px",
            width: "160px",
            borderRadius: "50%",
            margin: "auto",
            background: `linear-gradient(45deg, ${designData.accentColor}, ${designData.backgroundColor})`,
          }}
        >
          <img
            src={aboutData.image}
            alt={aboutData.displayName}
            style={{ height: "150px", width: "150px", border: "10px solid black", margin: "5px", borderRadius: "50%" }}
          />
        </div>

        <h1
          style={{
            background: `-webkit-linear-gradient(${designData.primaryFontColor}, ${designData.secondaryFontColor}) text`,
            WebkitTextFillColor: "transparent",
            fontFamily: designData.primaryFontFamily
          }}
        >
          {aboutData.displayName}
        </h1>

        <p className={styles.sm__intro}>{aboutData.title}</p>
        <p className={styles.intro__part} style={{ color: designData.secondaryFontColor, marginTop: "20px", fontSize: "20px" }}>{aboutData.description}</p>
        <Space size="large">
          <ul className={styles.social__links}>
            <li>
              <a
                href={aboutData.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramOutlined />
              </a>
            </li>
            <li>
              <a
                href={aboutData.githubLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubOutlined />
              </a>
            </li>
            <li>
              <a
                href={aboutData.linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedinOutlined />
              </a>
            </li>
            <li>
              <a
                href={aboutData.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <YoutubeOutlined />
              </a>
            </li>
          </ul>
        </Space>
      </section>
      <Articles config={articlesData} />
      <Projects config={projectsData} />
      <Presentations config={presentationData} />
    </div>
  );
};

export default SiteDesignPage;
