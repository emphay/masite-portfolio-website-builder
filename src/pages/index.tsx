import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import styles from "@/styles/Home.module.css";
import { Layout, Button, Spin, Space, Dropdown, Menu } from "antd";
import { PhoneOutlined, MailOutlined, WhatsAppOutlined } from "@ant-design/icons";
import Navigation from "@/components/builder/Nav/Navigation";
import About from "@/components/builder/About/About";
import Articles from "@/components/builder/Articles/Articles";
import Projects from "@/components/builder/Projects/Projects";
import Presentations from "@/components/builder/Presentations/Presentation";
import { NavConfig } from "@/components/builder/Nav/NavBuilder";
import { AboutConfig } from "@/components/builder/About/AboutBuilder";
import { ArticlesConfig } from "@/components/builder/Articles/ArticlesBuilder";
import { ProjectsConfig } from "@/components/builder/Projects/ProjectsBuilder";
import { PresentationConfig } from "@/components/builder/Presentations/PresentationsBuilder";
import { SiteDesignConfig } from "@/components/builder/sitedesign/SitedesignBuilder";
import {
  GithubOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
  InstagramOutlined,
  EllipsisOutlined
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { calc } from "antd/es/theme/internal";

const inter = Inter({ subsets: ["latin"] });
const { Sider, Content } = Layout;

export default function Home() {
  //const { data: session, status } = useSession();
  const router = useRouter();

  const [designData, setDesignData] = useState<SiteDesignConfig | undefined>(undefined);
  const [navData, setNavData] = useState<NavConfig | undefined>(undefined);
  const [aboutData, setAboutData] = useState<AboutConfig | undefined>(undefined);
  const [articlesData, setArticlesData] = useState<ArticlesConfig | undefined>(undefined);
  const [projectsData, setProjectsData] = useState<ProjectsConfig | undefined>(undefined);
  const [presentationData, setPresentationData] = useState<PresentationConfig | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesignData = async () => {
      // if (!session) {
      //   console.error("User session is not available");
      //   return;
      // }

      try {
        const response = await fetch("/api/getProfile");
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();

        // console.log("Data:", data);
        setLoading(false);

        const siteDesign = data.SiteDesign?.[0] || {};
        const contact = data.links.find((link: { icon: string }) => link.icon === "Contacts") || {};

        setDesignData({
          accentColor: siteDesign.accentColor,
          backgroundColor: siteDesign.backgroundColor,
          primaryFontColor: siteDesign.primaryFontColor,
          secondaryFontColor: siteDesign.secondaryFontColor,
          primaryFontFamily: siteDesign.primaryFontFamily,
          secondaryFontFamily: siteDesign.secondaryFontFamily,
        });

        setNavData({
          id: data.id,
          firstName: data.FirstName,
          lastName: data.LastName,
          aboutText: data.links.find((link: any) => link.url.startsWith("#about"))?.title || "",
          contactType: contact.title || "",
          contactValue: contact.url || "",
          articleText: data.links.find((link: any) => link.url.startsWith("#articles"))?.title || "",
          projectText: data.links.find((link: any) => link.url.startsWith("#projects"))?.title || "",
          presentationText: data.links.find((link: any) => link.url.startsWith("#presentations"))?.title || "",
          // Include the missing properties with either actual or default values
          accentColor: siteDesign.accentColor || "#000000",
          backgroundColor: siteDesign.backgroundColor || "#ffffff",
          primaryFontColor: siteDesign.primaryFontColor || "#000000",
          primaryFontFamily: siteDesign.primaryFontFamily || "Arial",
          secondaryFontColor: siteDesign.secondaryFontColor || "#666666",
          secondaryFontFamily: siteDesign.secondaryFontFamily || "Arial",
        });


        setAboutData({
          id: data.id,
          image: data.image,
          displayName: data.displayName,
          title: data.title,
          description: data.description,
          instagramLink:
            data.links.find((link: any) => link.title === "Instagram")?.url || "",
          linkedinLink:
            data.links.find((link: any) => link.title === "LinkedIn")?.url || "",
          githubLink:
            data.links.find((link: any) => link.title === "Github")?.url || "",
          youtubeLink:
            data.links.find((link: any) => link.title === "YouTube")?.url || "",
          accentColor: data.SiteDesign[0].accentColor,
          backgroundColor: data.SiteDesign[0].backgroundColor,
          primaryFontColor: data.SiteDesign[0].primaryFontColor,
          secondaryFontColor: data.SiteDesign[0].secondaryFontColor,
          primaryFontFamily: data.SiteDesign[0].primaryFontFamily,
          secondaryFontFamily: data.SiteDesign[0].secondaryFontFamily,
        });

        setArticlesData({
          id: data.id,
          articleThumbnail: data.ArticleConfig[0].articleThumbnail,
          articleDisplayLayout: data.ArticleConfig[0].articleDisplayLayout,
          articleFeedLink: data.ArticleConfig[0].articleFeedLink,
          primaryFontColor: data.SiteDesign[0].primaryFontColor,
          secondaryFontColor: data.SiteDesign[0].secondaryFontColor,
          primaryFontFamily: data.SiteDesign[0].primaryFontFamily,
          secondaryFontFamily: data.SiteDesign[0].secondaryFontFamily,
        });

        const githubLink = data.links.find((link: any) => link.title === "Github")?.url || "";
        const githubUsername = githubLink.split("/").pop() || "";

        setProjectsData({
          id: data.id,
          projectDisplayLayout: data.SiteDesign?.[0]?.projectDisplayLayout || "card",
          githubLink: data.links.find((link: any) => link.title === "Github")?.url || "",
          primaryFontFamily: data.SiteDesign?.[0]?.primaryFontFamily || "Arial",
          secondaryFontColor: data.SiteDesign?.[0]?.secondaryFontColor || "#666666",
          secondaryFontFamily: data.SiteDesign?.[0]?.secondaryFontFamily || "Arial",
          projects: (data.projects || []).map((project: any) => ({
            id: project.id || 0,
            projectTitle: project.projectTitle || "",
            projectDescription: project.projectDescription || "",
            projectLink: project.projectLink || "",
            isVisible: project.isVisible ?? true,
          })),
          handleProjectsConfigUpdate: (updatedConfig: ProjectsConfig) => {
            // Update the state with the new config
            setProjectsData(updatedConfig);
          }
        });


        setPresentationData({
          id: data.id,
          presentationDisplayLayout: siteDesign.presentationDisplayLayout || "Grid",
          presentationThumbnail: siteDesign.presentationThumbnail || "OFF",
          primaryFontColor: data.SiteDesign[0].primaryFontColor,
          secondaryFontColor: data.SiteDesign[0].secondaryFontColor,
          primaryFontFamily: data.SiteDesign[0].primaryFontFamily,
          secondaryFontFamily: data.SiteDesign[0].secondaryFontFamily,
          presentations: data.presentations.map((presentation: any) => ({
            presentationTitle: presentation.presentationTitle || "",
            presentationLink: presentation.presentationLink || "",
            presentationDescription: presentation.presentationDescription || "",
            dateOfPresentation: presentation.dateOfPresentation ? new Date(presentation.dateOfPresentation) : null,
          })),
        });

      } catch (error) {
        console.error("Error fetching design data:", error);
      }
    };

    fetchDesignData();
  });

  if (loading) {
    return (
      <Spin
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      />
    );
  }

  if (!designData || !navData || !aboutData || !articlesData || !projectsData || !presentationData) {
    return <div>Error loading data. Kindly Add Data</div>;
  }

  let contactIcon;
  let contactValue = navData.contactValue;

  switch (navData.contactType) {
    case 'Phone':
      contactIcon = <PhoneOutlined />;
      contactValue;
      break;
    case 'Email':
      contactIcon = <MailOutlined />;
      contactValue;
      break;
    case 'WhatsApp':
      contactIcon = <WhatsAppOutlined />;
      contactValue = `https://wa.me/${navData.contactValue}`;
      break;
    case 'Telegram':
      contactIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15">
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.5 1.5l-14 5l4 2l6-4l-4 5l6 4z"
          />
        </svg>
      );
      contactValue = `https://t.me/${navData.contactValue}`;
      break;
  }

  const menu = (
    <Menu>
      <Menu.Item key="sitedesign" onClick={() => router.push("/site/sitedesign")}>
        Customize
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Head>
        <title>Portfolio</title>
        <meta property="og:title" content="Masite: A Portfolio Website Builder" />
        <meta property="og:description" content="Create your own portfolio website effortlessly using Masite" />
        <meta property="og:image" content="https://raw.githubusercontent.com/emphay/masite-portfolio-website-builder/main/public/img/sitedesign.png" />
        <meta property="og:url" content="https://masite-portfolio-website-builder.vercel.app/" />
        <meta property="og:type" content="website" />
      </Head>
      <Layout style={{ backgroundColor: designData.backgroundColor }} className={styles.lay} >

        <Dropdown overlay={menu} placement="bottomRight">
          <Button shape="circle" icon={<EllipsisOutlined />} className={styles.customizeButton} />
        </Dropdown>

        <Layout.Content>
          <div style={{ width: "1000px", margin: "auto" }}>
            <div style={{ backgroundColor: designData.backgroundColor }}>
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
          </div>
          <footer style={{ display: "flex", borderTop: "1px solid #888", marginTop: "50px" }}>
            <div>
              <ul
                className={styles.navList}
                style={{ color: "#888" }}
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
              <div>
                <p style={{ color: "#888", fontWeight: "bold" }}>
                  &copy; {new Date().getFullYear()} {navData.firstName} {navData.lastName}. All rights reserved
                </p>
              </div>
            </div>
          </footer>

        </Layout.Content>
      </Layout>
    </>
  );
}

//@ts-ignore
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {

  return {
    props: {},
  };
};
