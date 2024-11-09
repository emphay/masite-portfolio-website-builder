import React, { useEffect, useState } from "react";
import Navigation from "../../components/builder/Nav/Navigation";
import { useSession } from "next-auth/react";
import NavBuilder, { NavConfig } from "@/components/builder/Nav/NavBuilder";
import SiteBuilderLayout from "../../components/Layouts/SiteBuilderLayout";
import { Spin } from 'antd';
import { NextPage } from "next";

const NavigationPage: NextPage = () => {
  const { data: session } = useSession();

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
      // console.log("Data: ", data);
      setLoading(false);

      const contact =
        data.links.filter(
          (link: { icon: string }) => link.icon === "Contacts"
        ) || [];

      setNavData({
        id: data.id,
        firstName: data.FirstName,
        lastName: data.LastName,
        aboutText:
          data.links.find((link: any) => link.url.startsWith("#about"))?.title ||
          "",
        contactType: contact[0].title,
        contactValue: contact[0].url,
        articleText: data.links.find((link: any) =>
          link.url.startsWith("#articles")
        ).title,
        projectText: data.links.find((link: any) =>
          link.url.startsWith("#projects")
        ).title,
        presentationText: data.links.find((link: any) =>
          link.url.startsWith("#presentations")
        ).title,
        accentColor: data.SiteDesign[0].accentColor,
        backgroundColor: data.SiteDesign[0].backgroundColor,
        primaryFontColor: data.SiteDesign[0].primaryFontColor,
        secondaryFontColor: data.SiteDesign[0].secondaryFontColor,
        primaryFontFamily: data.SiteDesign[0].primaryFontFamily,
        secondaryFontFamily: data.SiteDesign[0].secondaryFontFamily,
      });
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
        id: navConfig.id,
        firstName: navConfig.firstName,
        lastName: navConfig.lastName,
        aboutText: navConfig.aboutText,
        contactType: navConfig.contactType,
        contactValue: navConfig.contactValue,
        articleText: navConfig.articleText,
        projectText: navConfig.projectText,
        presentationText: navConfig.presentationText,
      };

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
