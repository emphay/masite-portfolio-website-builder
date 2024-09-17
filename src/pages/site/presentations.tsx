import React, { useEffect, useState } from "react";
import PresentationBuilder, { PresentationConfig, Presentation } from "@/components/builder/Presentations/PresentationsBuilder";
import { useSession } from "next-auth/react";
import SiteBuilderLayout from "@/components/Layouts/SiteBuilderLayout";
import Presentations from "@/components/builder/Presentations/Presentation";
import { Spin } from "antd";

const PresentationsPage: React.FC = () => {
  const { data: session } = useSession();
  const [presentationData, setPresentationData] = useState<PresentationConfig | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresentationData = async () => {
      try {
        const response = await fetch("/api/getProfile");
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();

        console.log("Data:", data);

        const siteDesign = data.SiteDesign && data.SiteDesign.length > 0 ? data.SiteDesign[0] : {};

        const presentations: Presentation[] = data.presentations.map((presentation: any) => ({
          presentationTitle: presentation.presentationTitle || "",
          presentationLink: presentation.presentationLink || "",
          presentationDescription: presentation.presentationDescription || "",
          dateOfPresentation: presentation.dateOfPresentation ? new Date(presentation.dateOfPresentation) : null,
        }));

        const presentConfig: PresentationConfig = {
          id: data.id,
          presentationDisplayLayout: siteDesign.presentationDisplayLayout || "Grid",
          presentationThumbnail: siteDesign.presentationThumbnail || "OFF",
          primaryFontColor: data.SiteDesign[0].primaryFontColor,
          secondaryFontColor: data.SiteDesign[0].secondaryFontColor,
          primaryFontFamily: data.SiteDesign[0].primaryFontFamily,
          secondaryFontFamily: data.SiteDesign[0].secondaryFontFamily,
          presentations,
        };

        console.log("Hello World: ", presentConfig);

        setPresentationData(presentConfig);
      } catch (error) {
        console.error("Error fetching presentation data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPresentationData();
  }, []);

  const savePresentationConfig = async (presentationConfig: PresentationConfig) => {
    try {
      console.log("The Presentation Data entered: ", presentationConfig);

      for (const presentation of presentationConfig.presentations) {
        const singlePresentationConfig = {
          id: presentationConfig.id,
          presentationDisplayLayout: presentationConfig.presentationDisplayLayout,
          presentationThumbnail: presentationConfig.presentationThumbnail,
          ...presentation,
        };

        const response = await fetch('/api/savePresentationData', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(singlePresentationConfig),
        });

        if (!response.ok) {
          // Extract error message from response body if available
          const errorData = await response.json();
          throw new Error(`Failed to save presentation configuration: ${errorData.error || 'Unknown error'}`);
        }

        const result = await response.json();
        console.log('Presentation configuration saved successfully:', result);
      }
    } catch (error: any) {
      console.error('Error saving presentation configuration:', error.message);
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
      {!loading && presentationData && (<>
        <Presentations config={presentationData} />
        <PresentationBuilder
          config={presentationData}
          setPresentationConfig={setPresentationData}
          savePresentationConfig={savePresentationConfig}
        /></>)}
    </SiteBuilderLayout>
  );
};

export default PresentationsPage;
