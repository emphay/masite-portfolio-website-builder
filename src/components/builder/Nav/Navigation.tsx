import React from "react";
import { Layout, Button } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import styles from "../../../styles/sitebuilder.module.css";
import { NavConfig } from "./NavBuilder";

const { Content } = Layout;

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

const Navigation: React.FC<{ config: NavConfig }> = ({ config }) => {

  const contactIcon = contactIconMapping[config.contactType] || null;
  const contactUrlPrefix = contactValueMapping[config.contactType] || "";
  const contactValue = `${contactUrlPrefix}${config.contactValue}`;

  return (
    <Content style={{ minHeight: "100vh", width: "915px", backgroundColor: config.backgroundColor, margin: "auto" }}>
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
                color: config.primaryFontColor,
                fontFamily: config.primaryFontFamily,
              }}
            >
              {config.firstName.toUpperCase()} {config.lastName.toUpperCase()}
            </span>
          </h1>
          <ul
            className={styles.navList}
            style={{
              color: config.secondaryFontColor,
              fontFamily: config.secondaryFontFamily,
            }}
          >
            <li>
              <a href="#About">{config.aboutText}</a>
            </li>
            <li>
              <a href="#Article">{config.articleText}</a>
            </li>
            <li>
              <a href="#Project">{config.projectText}</a>
            </li>
            <li>
              <a href="#Presentations">{config.presentationText}</a>
            </li>
          </ul>
          <Button
            className={styles.customButton}
            icon={contactIcon}
            href={contactValue}
            style={{
              backgroundColor: config.accentColor,
              borderColor: config.accentColor,
            }}
          >
            {config.contactType}
          </Button>
        </nav>
      </header>
    </Content>
  );
};

export default Navigation;
