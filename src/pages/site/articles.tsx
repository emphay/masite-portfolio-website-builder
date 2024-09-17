import React, { useEffect, useState } from "react";
import ArticlesBuilder, {
  ArticlesConfig,
} from "@/components/builder/Articles/ArticlesBuilder";
import { useSession } from "next-auth/react";
import Articles from "@/components/builder/Articles/Articles";
import SiteBuilderLayout from "../../components/Layouts/SiteBuilderLayout";
import { message, Spin } from "antd";

const ArticlesPage: React.FC = () => {
  const { data: session } = useSession();
  const [articleData, setArticleData] = useState<ArticlesConfig>({
    id: "",
    articleThumbnail: "",
    articleDisplayLayout: "",
    articleFeedLink: "",
    primaryFontFamily: "",
    secondaryFontFamily: "",
    primaryFontColor: "#000000", // Default or placeholder value
    secondaryFontColor: "#000000" // Default or placeholder value
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        const response = await fetch("/api/getProfile");
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();

        console.log("Data:", data);
        setLoading(false);
        setArticleData({
          id: data.id,
          articleThumbnail: data.ArticleConfig[0].articleThumbnail,
          articleDisplayLayout: data.ArticleConfig[0].articleDisplayLayout,
          articleFeedLink: data.ArticleConfig[0].articleFeedLink,
          primaryFontColor: data.SiteDesign[0].primaryFontColor,
          secondaryFontColor: data.SiteDesign[0].secondaryFontColor,
          primaryFontFamily: data.SiteDesign[0].primaryFontFamily,
          secondaryFontFamily: data.SiteDesign[0].secondaryFontFamily,
        });
      } catch (error) {
        console.error("Error fetching articles data:", error);
      }
    };

    fetchArticleData();
  }, []);

  const saveArticleConfig = async (articleConfig: ArticlesConfig) => {
    try {
      const filteredArticleData = {
        id: articleConfig.id,
        articleDisplayLayout: articleConfig.articleDisplayLayout,
        articleThumbnail: articleConfig.articleThumbnail,
        articleFeedLink: articleConfig.articleFeedLink,
        primaryFontColor: articleConfig.primaryFontColor, // Ensure these fields are saved
        secondaryFontColor: articleConfig.secondaryFontColor,
      };
      console.log("Data entered: ", filteredArticleData);
      const response = await fetch("/api/saveArticlesData", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filteredArticleData),
      });
      if (!response.ok) {
        throw new Error("Failed to save profile data");
      }
      const result = await response.json();
      message.success("Profile Saved Successfully");
      console.log("Profile saved successfully:", result);
    } catch (error) {
      console.error("Error saving profile data:", error);
      message.error("Failed to save profile data");
    }
  };

  return (
    <SiteBuilderLayout>
      {loading && <Spin
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      />}
      {!loading && articleData && (
        <>
          <Articles config={articleData} />
          <ArticlesBuilder
            config={articleData}
            setArticlesConfig={(newConfig) => {
              if (newConfig) {
                setArticleData(newConfig);
              }
            }}
            saveArticlesConfig={saveArticleConfig}
          />
        </>
      )}
    </SiteBuilderLayout>
  );
};

export default ArticlesPage;
