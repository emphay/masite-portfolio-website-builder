import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { FC, useEffect, useState } from "react";
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
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const inter = Inter({ subsets: ["latin"] });
const { Sider, Content } = Layout;

interface HomeProps {
  designData: any;
  navData: any;
  aboutData: any;
  articlesData: any;
  projectsData: any;
  presentationData: any;
}

const Home: FC<HomeProps> = ({
  designData,
  navData,
  aboutData,
  articlesData,
  projectsData,
  presentationData
}) => {

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Design Data:", designData);
    console.log("Nav Data:", navData);
    console.log("About Data:", aboutData);
    console.log("Articles Data:", articlesData);
    console.log("Projects Data:", projectsData);
    console.log("Presentation Data:", presentationData);
    if (!designData) console.log("Missing: designData");
    if (!navData) console.log("Missing: navData");
    if (!aboutData) console.log("Missing: aboutData");
    if (!articlesData) console.log("Missing: articlesData");
    if (!projectsData) console.log("Missing: projectsData");
    if (!presentationData) console.log("Missing: presentationData");

    if (designData && navData && aboutData && articlesData && projectsData && presentationData) {
      setLoading(false);
    } else {
      console.log("Some data is missing");
    }
  }, [designData, navData, aboutData, articlesData, projectsData, presentationData]);



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
  console.log("Design Data", designData);

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

        <title>Masite: A Portfolio Website Builder</title>
        <meta name="description" content="Masite is the ultimate portfolio website builder, crafted for professionals, freelancers, and creatives who want to build beautiful, responsive, and fully customized websites effortlessly. Showcase your work, share your story, and stand out online—all without writing a single line of code." />

        <meta property="og:url" content="https://masite-portfolio-website-builder.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:type" content="Masite: A Portfolio Website Builder" />
        <meta property="og:description" content="Masite is the ultimate portfolio website builder, crafted for professionals, freelancers, and creatives who want to build beautiful, responsive, and fully customized websites effortlessly. Showcase your work, share your story, and stand out online—all without writing a single line of code." />
        <meta property="og:image" content="https://raw.githubusercontent.com/emphay/masite-portfolio-website-builder/main/public/img/sitedesign.png" />

        <meta property="twitter:card" content="" />
        <meta property="twitter:title" content="Masite: A Portfolio Website Builder" />
        <meta property="twitter:description" content="Masite is the ultimate portfolio website builder, crafted for professionals, freelancers, and creatives who want to build beautiful, responsive, and fully customized websites effortlessly. Showcase your work, share your story, and stand out online—all without writing a single line of code." />
        <meta property="twitter:image" content="https://raw.githubusercontent.com/emphay/masite-portfolio-website-builder/main/public/img/sitedesign.png" />

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
  const user = await prisma.user.findFirst({
    select: {
      id: true,
      FirstName: true,
      LastName: true,
      username: true,
      email: true,
      image: true,
      displayName: true,
      title: true,
      description: true,
      links: true,
      projects: true,
      presentations: true,
      SiteDesign: true,
      ArticleConfig: true,
    },
  });
  console.log(user);

  if (!user) {
    return {
      notFound: true,
    };
  }

  const presentations = user.presentations.map(presentation => ({
    ...presentation,
    dateOfPresentation: presentation.dateOfPresentation.toISOString(),
  }));

  const navLinks = user.links.reduce((acc: any, link: any) => {
    if (link.url.startsWith("#")) {
      acc[link.url.substring(1)] = link.title;
    }
    return acc;
  }, {});

  const contactLink = user.links.find((link: any) => link.icon === "Contacts");

  return {
    props: {
      designData: {
        accentColor: user.SiteDesign[0]?.accentColor || "#000000",
        backgroundColor: user.SiteDesign[0]?.backgroundColor || "#ffffff",
        primaryFontColor: user.SiteDesign[0]?.primaryFontColor || "#000000",
        secondaryFontColor: user.SiteDesign[0]?.secondaryFontColor || "#666666",
        primaryFontFamily: user.SiteDesign[0]?.primaryFontFamily || "Arial",
        secondaryFontFamily: user.SiteDesign[0]?.secondaryFontFamily || "Arial",
      },
      navData: {
        id: user.id,
        firstName: user.FirstName,
        lastName: user.LastName,
        aboutText: navLinks.about || "About",
        articleText: navLinks.articles || "Articles",
        projectText: navLinks.projects || "Projects",
        presentationText: navLinks.presentations || "Presentations",
        contactType: contactLink?.title || "",
        contactValue: contactLink?.url || "",
        accentColor: user.SiteDesign[0]?.accentColor || "#000000",
        backgroundColor: user.SiteDesign[0]?.backgroundColor || "#ffffff",
        primaryFontColor: user.SiteDesign[0]?.primaryFontColor || "#000000",
        primaryFontFamily: user.SiteDesign[0]?.primaryFontFamily || "Arial",
        secondaryFontColor: user.SiteDesign[0]?.secondaryFontColor || "#666666",
        secondaryFontFamily: user.SiteDesign[0]?.secondaryFontFamily || "Arial",
      },
      aboutData: {
        id: user.id,
        image: user.image,
        displayName: user.displayName,
        title: user.title,
        description: user.description,
        instagramLink: user.links.find((link: any) => link.title === "Instagram")?.url || "",
        linkedinLink: user.links.find((link: any) => link.title === "LinkedIn")?.url || "",
        githubLink: user.links.find((link: any) => link.title === "Github")?.url || "",
        youtubeLink: user.links.find((link: any) => link.title === "YouTube")?.url || "",
        accentColor: user.SiteDesign[0]?.accentColor || "#000000",
        backgroundColor: user.SiteDesign[0]?.backgroundColor || "#ffffff",
        primaryFontColor: user.SiteDesign[0]?.primaryFontColor || "#000000",
        secondaryFontColor: user.SiteDesign[0]?.secondaryFontColor || "#666666",
        primaryFontFamily: user.SiteDesign[0]?.primaryFontFamily || "Arial",
        secondaryFontFamily: user.SiteDesign[0]?.secondaryFontFamily || "Arial",
      },
      articlesData: {
        id: user.id,
        articleThumbnail: user.ArticleConfig[0]?.articleThumbnail || "",
        articleDisplayLayout: user.ArticleConfig[0]?.articleDisplayLayout || "list",
        articleFeedLink: user.ArticleConfig[0]?.articleFeedLink || "",
        primaryFontColor: user.SiteDesign[0]?.primaryFontColor || "#000000",
        secondaryFontColor: user.SiteDesign[0]?.secondaryFontColor || "#666666",
        primaryFontFamily: user.SiteDesign[0]?.primaryFontFamily || "Arial",
        secondaryFontFamily: user.SiteDesign[0]?.secondaryFontFamily || "Arial",
      },
      projectsData: {
        id: user.id,
        projectDisplayLayout: user.SiteDesign[0]?.projectDisplayLayout || "card",
        githubLink: user.links.find((link: any) => link.title === "Github")?.url || "",
        primaryFontFamily: user.SiteDesign[0]?.primaryFontFamily || "Arial",
        secondaryFontColor: user.SiteDesign[0]?.secondaryFontColor || "#666666",
        secondaryFontFamily: user.SiteDesign[0]?.secondaryFontFamily || "Arial",
        projects: (user.projects || []).map((project: any) => ({
          id: project.id,
          projectTitle: project.projectTitle || "",
          projectDescription: project.projectDescription || "",
          projectLink: project.projectLink || "",
          isVisible: project.isVisible ?? true,
        })),
      },
      presentationData: {
        id: user.id,
        presentationDisplayLayout: user.SiteDesign[0]?.presentationDisplayLayout || "Grid",
        presentationThumbnail: user.SiteDesign[0]?.presentationThumbnail || "OFF",
        primaryFontColor: user.SiteDesign[0]?.primaryFontColor || "#000000",
        secondaryFontColor: user.SiteDesign[0]?.secondaryFontColor || "#666666",
        primaryFontFamily: user.SiteDesign[0]?.primaryFontFamily || "Arial",
        secondaryFontFamily: user.SiteDesign[0]?.secondaryFontFamily || "Arial",
        presentations: presentations.map((presentation: any) => ({
          presentationTitle: presentation.presentationTitle,
          presentationLink: presentation.presentationLink,
          presentationDescription: presentation.presentationDescription,
          dateOfPresentation: presentation.dateOfPresentation,
        })),
      },
    },
  };
};
export default Home;