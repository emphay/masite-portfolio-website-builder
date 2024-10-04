import React, { useEffect, useState } from "react";
import { Form, Input, Button, Layout, Switch, Segmented } from "antd";
import { MenuOutlined, AppstoreOutlined } from "@ant-design/icons";
import styles from "../../../styles/sitebuilder.module.css";

const { Sider } = Layout;

interface ArticlesBuilderProps {
  id: string;
  articleThumbnail: string;
  articleDisplayLayout: string;
  articleFeedLink: string;
  handleArticlesConfigUpdate: (conf: ArticlesConfig) => void;
}

export interface ArticlesConfig {
  id: string;
  articleThumbnail: string;
  articleDisplayLayout: string;
  articleFeedLink: string;
  primaryFontColor: string;
  primaryFontFamily: string;
  secondaryFontColor: string;
  secondaryFontFamily: string;
}

const ArticlesBuilder: React.FC<{
  config: ArticlesConfig;
  setArticlesConfig: React.Dispatch<React.SetStateAction<ArticlesConfig>>;
  saveArticlesConfig: (articlesConfig: ArticlesConfig) => void;
}> = ({ config, setArticlesConfig, saveArticlesConfig }) => {
  const [thumbnailSwitch, setThumbnailSwitch] = useState<boolean>(false);
  // Change type here from string to 'Grid' | 'Card'
  const [layout, setLayout] = useState<'Grid' | 'Card'>('Grid');
  console.log("Articles Config: ", config);

  useEffect(() => {
    // Set the initial state based on the config
    setThumbnailSwitch(config.articleThumbnail === "ON");
    setLayout(config.articleDisplayLayout as 'Grid' | 'Card'); // Add type assertion here
  }, [config.articleThumbnail, config.articleDisplayLayout]);

  const handleThumbnailSwitchChange = (checked: boolean) => {
    setThumbnailSwitch(checked);
    setArticlesConfig({
      ...config,
      articleThumbnail: checked ? "ON" : "OFF",
    });
  };

  // No changes needed here, since the type is now correct
  const handleLayoutChange = (value: 'Grid' | 'Card') => {
    setLayout(value);
    setArticlesConfig({ ...config, articleDisplayLayout: value });
  };

  const updateArticleInfo = () => {
    saveArticlesConfig(config);
  };

  return (
    <div
      style={{
        background: "white",
        minWidth: "300px",
        padding: "20px",
        height: "100vh",
        overflowY: "auto",
        scrollBehavior: "smooth",
        position: "fixed",
        right: "0"
      }}
    >
      <h1>Articles</h1>
      <div
        style={{
          border: "1px solid #eee",
          padding: "20px",
          marginTop: "30px",
        }}
      >
        <h3>Source Feed</h3>
        <p>RSS Feed</p>
        <Input
          placeholder="https://medium.com/@username/feed"
          value={config.articleFeedLink}
          onChange={(e) =>
            setArticlesConfig({
              ...config,
              articleFeedLink: e.currentTarget.value,
            })
          }
        />
      </div>
      <div
        style={{
          border: "1px solid #eee",
          padding: "20px",
          marginTop: "30px",
        }}
      >
        <h3>Design</h3>
        <p>Display Layout</p>
        <Segmented
          options={[
            { label: <><MenuOutlined /> Grid</>, value: 'Grid' },
            { label: <><AppstoreOutlined /> Card</>, value: 'Card' }
          ]}
          value={layout}
          onChange={handleLayoutChange}
          style={{ border: "none", fontSize: "13px" }}
        />
        <p style={{ marginTop: "25px" }}>Show Thumbnail</p>
        <Switch
          checked={thumbnailSwitch}
          onChange={handleThumbnailSwitchChange}
        />
        <p>Thumbnail State: {thumbnailSwitch ? "ON" : "OFF"}</p>
      </div>
      <div>
        <Button
          type="primary"
          onClick={updateArticleInfo}
          style={{
            backgroundColor: "#3BAFDE",
            borderColor: "#3BAFDE",
            color: "white",
            marginTop: "20px"
          }}
        >
          Update Preferences
        </Button>
      </div>
    </div>
  );
};

export default ArticlesBuilder;
