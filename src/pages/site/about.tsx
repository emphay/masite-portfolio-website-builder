import React, { useEffect, useState } from "react";
import AboutBuilder, { AboutConfig } from "@/components/builder/About/AboutBuilder";
import { useSession } from "next-auth/react";
import About from "@/components/builder/About/About";
import SiteBuilderLayout from "../../components/Layouts/SiteBuilderLayout";
import { Spin, message } from 'antd';

const AboutPage: React.FC = () => {
  const { data: session } = useSession();
  const [aboutData, setAboutData] = useState<AboutConfig>({
    id: "",
    image: "",
    displayName: "",
    title: "",
    description: "",
    instagramLink: "",
    linkedinLink: "",
    githubLink: "",
    youtubeLink: "",
    accentColor: "",
    backgroundColor: "",
    primaryFontColor: "",
    primaryFontFamily: "",
    secondaryFontColor: "",
    secondaryFontFamily: ""
  });

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/getProfile");
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();

        console.log("Data:", data);
        setUserId(data.id);
        setAboutData(prevAboutData => ({
          ...prevAboutData,
          id: data.id,
          image: data.image,
          displayName: data.displayName,
          title: data.title,
          description: data.description,
          instagramLink: data.links.find((link: { title: string; }) => link.title === "Instagram")?.url || "",
          linkedinLink: data.links.find((link: { title: string; }) => link.title === "LinkedIn")?.url || "",
          githubLink: data.links.find((link: { title: string; }) => link.title === "Github")?.url || "",
          youtubeLink: data.links.find((link: { title: string; }) => link.title === "YouTube")?.url || "",
          accentColor: data.SiteDesign[0]?.accentColor || prevAboutData.accentColor,
          backgroundColor: data.SiteDesign[0]?.backgroundColor || prevAboutData.backgroundColor,
          primaryFontColor: data.SiteDesign[0]?.primaryFontColor || prevAboutData.primaryFontColor,
          secondaryFontColor: data.SiteDesign[0]?.secondaryFontColor || prevAboutData.secondaryFontColor,
          primaryFontFamily: data.SiteDesign[0]?.primaryFontFamily || prevAboutData.primaryFontFamily,
          secondaryFontFamily: data.SiteDesign[0]?.secondaryFontFamily || prevAboutData.secondaryFontFamily,
        }));
      } catch (error) {
        console.error("Error fetching profile data:", error);
        message.error("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const saveAboutConfig = async (aboutConfig: AboutConfig) => {
    if (!userId) {
      message.error("User ID is not available.");
      return;
    }

    const filteredAboutData = {
      id: userId,
      image: aboutConfig.image,
      displayName: aboutConfig.displayName,
      title: aboutConfig.title,
      description: aboutConfig.description,
      instagram: aboutConfig.instagramLink,
      linkedin: aboutConfig.linkedinLink,
      github: aboutConfig.githubLink,
      youtube: aboutConfig.youtubeLink,
    };

    console.log("Data entered: ", filteredAboutData);

    try {
      const response = await fetch("/api/saveAboutData", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filteredAboutData),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile data");
      }

      const result = await response.json();
      console.log("Profile saved successfully:", result);
      message.success("Profile saved successfully.");
    } catch (error) {
      console.error("Error saving profile data:", error);
      message.error("Failed to save profile data.");
    }
  };

  return (
    <SiteBuilderLayout>
      {loading ? (
        <Spin
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
          }}
        />
      ) : (
        <About config={aboutData} />
      )}
      <AboutBuilder
        config={aboutData}
        setAboutConfig={setAboutData}
        saveAboutConfig={saveAboutConfig}
      />
    </SiteBuilderLayout>
  );
};

export default AboutPage;
