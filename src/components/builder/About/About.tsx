import React from "react";
import { Layout, Space } from "antd";
import {
  PhoneOutlined,
  GithubOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
  InstagramOutlined,
} from "@ant-design/icons";
import styles from "../../../styles/sitebuilder.module.css";
import { AboutConfig } from "./AboutBuilder";
import { useSession } from "next-auth/react";

const { Content } = Layout;

interface UserConfig {
  image: string;
  displayName: string;
  title: string;
  description: string;
}

interface AboutPageProps {
  AboutProps: AboutConfig;
  userConfig: UserConfig;
}

const iconMapping = {
  LinkedIn: (
    <LinkedinOutlined style={{ fontSize: "30px", marginRight: "5px" }} />
  ),
  YouTube: <YoutubeOutlined style={{ fontSize: "30px", marginRight: "5px" }} />,
  Instagram: (
    <InstagramOutlined style={{ fontSize: "30px", marginRight: "5px" }} />
  ),
  Github: <GithubOutlined style={{ fontSize: "30px", marginRight: "5px" }} />,
};

const About: React.FC<{ config: AboutConfig }> = ({ config }) => {
  const { data: session } = useSession();

  console.log("Config: ", config);
  // Assuming config.links is an array of link objects

  return (
    <Content>
      <section id="About" className={styles.home} style={{ marginTop: "150px" }}>
        <div
          style={{
            height: "160px",
            width: "160px",
            borderRadius: "50%",
            margin: "auto",
            background: `linear-gradient(45deg, ${config.accentColor}, ${config.backgroundColor})`,
          }}
        >
          <img
            src={config.image}
            alt={config.displayName}
            style={{ height: "150px", width: "150px", border: "10px solid black", margin: "5px", borderRadius: "50%" }}
          />
        </div>

        <h1
          style={{
            background: `-webkit-linear-gradient(${config.primaryFontColor}, ${config.secondaryFontColor}) text`,
            WebkitTextFillColor: "transparent",
            fontFamily: config.primaryFontFamily
          }}
        >
          {config.displayName}
        </h1>
        <p className={styles.sm__intro}>{config.title}</p>
        <p className={styles.intro__part} style={{ color: config.secondaryFontColor, marginTop: "20px", fontSize: "20px" }}>{config.description}</p>
        <Space size="large">
          <ul className={styles.social__links}>
            <li>
              <a
                href={config.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramOutlined />
              </a>
            </li>
            <li>
              <a
                href={config.githubLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubOutlined />
              </a>
            </li>
            <li>
              <a
                href={config.linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedinOutlined />
              </a>
            </li>
            <li>
              <a
                href={config.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <YoutubeOutlined />
              </a>
            </li>
          </ul>
        </Space>
      </section>
    </Content>
  );
};

export default About;
