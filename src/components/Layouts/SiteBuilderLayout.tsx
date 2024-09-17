import { Layout } from "antd";
import Head from "next/head";
import { FC, ReactNode } from "react";
import Sidebar from "../SiteBuilder/Sidebar";
import { useSession } from "next-auth/react";
import styles from "../../styles/sitebuilder.module.css";

const { Content } = Layout;

interface LayoutProps {
  children: ReactNode;
  flexDirection?: 'row' | 'column'; // Optional prop to determine flex direction
}

const SiteBuilderLayout: FC<LayoutProps> = ({ children, flexDirection = 'row' }) => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Portfolio Website</title>
        <meta
          name="description"
          content="A portfolio website built with Next.js and Ant Design"
        />
      </Head>
      <Layout className={styles.layout}>
        <Sidebar session={session} />
        <Content style={{ display: "flex", flexDirection: flexDirection }}>
          {children}
        </Content>
      </Layout>
    </>
  );
};

export default SiteBuilderLayout;
