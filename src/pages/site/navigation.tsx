import React, { useEffect, useState } from "react";
import Navigation from "../../components/builder/Nav/Navigation";
import { useSession } from "next-auth/react";
import NavBuilder, { NavConfig } from "@/components/builder/Nav/NavBuilder";
import SiteBuilderLayout from "../../components/Layouts/SiteBuilderLayout";
import { message, Spin } from 'antd';
import { NextPage } from "next";

const NavigationPage: NextPage = () => {
  const { data: session } = useSession();
  const [userId, setUserId] = useState<string | null>(null);

  const [navData, setNavData] = useState<NavConfig>({
    id: "",
    firstName: "",
    lastName: "",
    aboutText: "",
    contactType: "",
    contactValue: "",
    articleText: "",
    projectText: "",
    presentationText: "",
    accentColor: "",
    backgroundColor: "",
    primaryFontColor: "",
    primaryFontFamily: "",
    secondaryFontColor: "",
    secondaryFontFamily: ""
  });
  const [loading, setLoading] = useState(true);

  const fetchNavData = async () => {
    try {
      const response = await fetch("/api/getProfile");
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      const data = await response.json();
      //initialize the state of the navConfig
      // setNavData({
      //     firstName: data.firstName,
      //     lastName: data.lastName
      // })
      console.log("Data: ", data);
      setLoading(false);
      setUserId(data.id);

      const contact =
        data.links.filter(
          (link: { icon: string }) => link.icon === "Contacts"
        ) || [];

      setNavData((prevNavData) => ({
        ...prevNavData, // Spread the previous state to keep existing id
        id: data.id, // Ensure id is set to the fetched data
        firstName: data.FirstName || prevNavData.firstName, // Update if new data exists
        lastName: data.LastName || prevNavData.lastName,
        aboutText: data.links.find((link: any) => link.url.startsWith("#about"))?.title || prevNavData.aboutText,
        contactType: contact[0]?.title || prevNavData.contactType,
        contactValue: contact[0]?.url || prevNavData.contactValue,
        articleText: data.links.find((link: any) => link.url.startsWith("#articles"))?.title || prevNavData.articleText,
        projectText: data.links.find((link: any) => link.url.startsWith("#projects"))?.title || prevNavData.projectText,
        presentationText: data.links.find((link: any) => link.url.startsWith("#presentations"))?.title || prevNavData.presentationText,
        accentColor: data.SiteDesign[0]?.accentColor || prevNavData.accentColor,
        backgroundColor: data.SiteDesign[0]?.backgroundColor || prevNavData.backgroundColor,
        primaryFontColor: data.SiteDesign[0]?.primaryFontColor || prevNavData.primaryFontColor,
        secondaryFontColor: data.SiteDesign[0]?.secondaryFontColor || prevNavData.secondaryFontColor,
        primaryFontFamily: data.SiteDesign[0]?.primaryFontFamily || prevNavData.primaryFontFamily,
        secondaryFontFamily: data.SiteDesign[0]?.secondaryFontFamily || prevNavData.secondaryFontFamily,
      }));
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    fetchNavData();
  }, []);

  const saveNavConfig = async (navConfig: NavConfig) => {
    try {
      const filteredNavData = {
        id: userId,
        firstName: navConfig.firstName,
        lastName: navConfig.lastName,
        aboutText: navConfig.aboutText,
        contactType: navConfig.contactType,
        contactValue: navConfig.contactValue,
        articleText: navConfig.articleText,
        projectText: navConfig.projectText,
        presentationText: navConfig.presentationText,
      };
      console.log(filteredNavData);

      const response = await fetch("/api/saveNavData", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filteredNavData),
      });
      console.log("Nav: ", filteredNavData);
      if (!response.ok) {
        throw new Error("Failed to save profile data");
      }

      const result = await response.json();
      console.log("Profile saved successfully:", result);
      message.success("Data saved successfully");
    } catch (error) {
      console.error("Error saving profile data:", error);
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
      {!loading && navData && (<>
        <Navigation config={navData} />
        <NavBuilder
          config={navData}
          setNavConfig={setNavData}
          saveNavConfig={saveNavConfig}
        /></>)}
    </SiteBuilderLayout>
  );
};

export default NavigationPage;
