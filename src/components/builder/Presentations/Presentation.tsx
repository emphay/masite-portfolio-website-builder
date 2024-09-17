import React from "react";
import { Layout } from "antd";
import styles from "../../../styles/sitebuilder.module.css";
import { PresentationConfig } from "./PresentationsBuilder";
import dayjs from 'dayjs';
import { useRouter } from "next/router";

const { Content } = Layout;

interface Presentation {
  presentationTitle: string;
  presentationLink: string;
  presentationDescription: string;
  dateOfPresentation: Date;
}

const formatDate = (date: Date | null) => {
  if (!date) return '';
  return dayjs(date).format('MMMM D, YYYY');
};

const extractVideoEmbed = (url: string): string | null => {
  const youtubeMatch = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;

  const vimeoMatch = url.match(
    /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:\w+\/)?videos\/|album\/(?:\d+\/)?video\/|video\/|)(\d+)(?:$|\/|\?)/
  );
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  const dailymotionMatch = url.match(
    /(?:https?:\/\/)?(?:www\.)?dailymotion.com\/video\/([^_]+)/
  );
  if (dailymotionMatch) return `https://www.dailymotion.com/embed/video/${dailymotionMatch[1]}`;

  const facebookMatch = url.match(
    /(?:https?:\/\/)?(?:www\.)?facebook.com\/(?:[^\/]+\/videos\/|video.php\?v=)(\d+)/
  );
  if (facebookMatch) return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`;

  return null;
};

const Presentations: React.FC<{ config: PresentationConfig }> = ({ config }) => {
  const layout = config.presentationDisplayLayout;
  const router = useRouter();

  const getContentStyle = () => {
    const path = router.pathname;

    if (path === "/site/presentations") {
      return { width: "915px", marginLeft: "20vw" };
    }
    return {};
  };

  return (
    <Content>
      <section id="Presentations" style={getContentStyle()}>
        <h2 style={{ marginLeft: "20px", fontFamily: config.primaryFontFamily }}>Presentations</h2>
        <div
          className={
            layout === "Grid" ? styles.presentationgrid : styles.presentationList
          }
        >
          {config.presentations && config.presentations.length > 0 ? (
            config.presentations.map((presentation, index) => {
              const embedUrl = extractVideoEmbed(presentation.presentationLink);
              return (
                <div
                  key={index}
                  style={{
                    background: "white",
                    padding: "20px",
                    ...(config.presentationDisplayLayout === "Card"
                      ? { display: "flex", gap: "20px" }
                      : {}),
                  }}
                >

                  {config.presentationThumbnail === "ON" && embedUrl && (
                    <div>
                      <iframe
                        width="380"
                        height="250"
                        src={embedUrl}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={presentation.presentationTitle}
                      ></iframe>
                    </div>
                  )}
                  <div>
                    <p style={{ fontSize: "20px", margin: "10px 10px 10px 0", fontFamily: config.primaryFontFamily, color: config.primaryFontColor }}>
                      {presentation.presentationTitle}
                    </p>
                    <p style={{ fontFamily: config.secondaryFontFamily }}>
                      Link:{" "}
                      <a
                        href={presentation.presentationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {presentation.presentationLink}
                      </a>
                    </p>
                    <p style={{ fontFamily: config.secondaryFontFamily, color: config.secondaryFontColor }}>
                      {presentation.presentationDescription
                        ? `Description: ${presentation.presentationDescription}`
                        : "No description found"}
                    </p>
                    <p style={{ fontFamily: config.secondaryFontFamily, color: config.secondaryFontColor }}>Date: {formatDate(presentation.dateOfPresentation)}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No visible presentations found.</p>
          )}
        </div>
      </section>
    </Content>
  );
};

export default Presentations;
