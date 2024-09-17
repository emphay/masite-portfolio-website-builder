import { Layout } from "antd";
import { useSession } from "next-auth/react";
import React, { FC } from "react";
import Sidebar from "../SiteBuilder/Sidebar";
import NavigationPage from "@/pages/site/navigation";

const SiteBuilder = () => {
  const { data: session } = useSession();

  return (
    <Layout>
      <Sidebar session={session}></Sidebar>
      <Layout>
        <NavigationPage />
      </Layout>
    </Layout>
  );
};
export default SiteBuilder;
