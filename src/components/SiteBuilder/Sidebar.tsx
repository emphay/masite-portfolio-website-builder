import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { WalletOutlined, AppstoreOutlined } from "@ant-design/icons";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styles from "../../styles/sitebuilder.module.css";
import Link from "next/link";

const { Sider } = Layout;

const Sidebar: React.FC<{ session: any }> = ({ session }) => {
  const { asPath } = useRouter(); // Get the current route
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // Determine the active menu key based on the current route
  const getSelectedKey = () => {
    if (asPath.includes("/site/projects")) return "projects";
    if (asPath.includes("/site/nav")) return "navigation";
    if (asPath.includes("/site/about")) return "about";
    if (asPath.includes("/site/articles")) return "articles";
    if (asPath.includes("/site/presentations")) return "presentations";
    return "siteDesign"; // Default key
  };

  // Determine which submenu to open based on the current route
  const determineOpenKeys = () => {
    const sectionKeys = ["navigation", "about", "articles", "projects", "presentations"];
    return sectionKeys.some(key => asPath.includes(`/site/${key}`)) ? ["section"] : [];
  };

  // Handle menu open change
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  return (
    <Sider className={styles.siderContainer} width={300} theme="light" style={{ position: "fixed", height: "100vh" }}>
      <img src="https://ik.imagekit.io/mrinalprakash4577/logo.png" height="40px" width="40px" alt="User Avatar" />
      <h4 onClick={() => signOut()}>
        {session?.user?.name.split(' ')[0]}
      </h4>
      <p style={{ marginTop: "-12px" }}>{session?.user?.email}</p>
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]} // Use getSelectedKey to set the active key
        openKeys={openKeys.length ? openKeys : determineOpenKeys()} // Use openKeys or determineOpenKeys
        onOpenChange={handleOpenChange} // Handle open/close of submenus
        style={{ borderRight: 0 }}
      >
        <Menu.Item key="siteDesign" icon={<WalletOutlined />}>
          <Link href={`/site/sitedesign`}>Site Design</Link>
        </Menu.Item>
        <Menu.SubMenu key="section" icon={<AppstoreOutlined />} title="Section" >
          <Menu.Item key="navigation">
            <Link href={`/site/navigation`}>Navigation</Link>
          </Menu.Item>
          <Menu.Item key="about">
            <Link href={`/site/about`}>About</Link>
          </Menu.Item>
          <Menu.Item key="articles">
            <Link href={`/site/articles`}>Articles</Link>
          </Menu.Item>
          <Menu.Item key="projects">
            <Link href={`/site/projects`}>Projects</Link>
          </Menu.Item>
          <Menu.Item key="presentations">
            <Link href={`/site/presentations`}>Presentations</Link>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
