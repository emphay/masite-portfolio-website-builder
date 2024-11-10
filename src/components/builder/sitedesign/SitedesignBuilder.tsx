import { Button, ColorPicker, Form, Select } from "antd";
import React, { useEffect, useState } from "react";
import styles from "@/styles/sitebuilder.module.css";

export interface SiteDesignConfig {
  id: string;
  accentColor: string;
  backgroundColor: string;
  primaryFontColor: string;
  secondaryFontColor: string;
  primaryFontFamily: string;
  secondaryFontFamily: string;
}

const SitedesignBuilder: React.FC<{
  config: SiteDesignConfig;
  setSiteDesignConfig: React.Dispatch<React.SetStateAction<SiteDesignConfig>>;
  saveSiteDesignConfig: (siteDesignConfig: SiteDesignConfig) => void;
}> = ({ config, setSiteDesignConfig, saveSiteDesignConfig }) => {
  const [fontOptions, setFontOptions] = useState<{ label: string; value: string }[]>([]);

  console.log("Site Design Config: ", config);

  useEffect(() => {
    fetch("/api/fonts")
      .then((response) => response.json())
      .then((data) => {
        const fonts = data.fonts || [];
        const formattedFonts = fonts.map((font: string) => ({
          label: font.replace(/"/g, ""),
          value: font.replace(/"/g, ""),
        }));
        setFontOptions(formattedFonts);
      })
      .catch((error) => console.error("Error fetching fonts:", error));
  }, []);

  const handleColorChange = (colorType: keyof SiteDesignConfig) => (color: any, hex: string) => {
    setSiteDesignConfig((prevConfig) => ({
      ...prevConfig,
      [colorType]: hex,
    }));
  };

  const handleFontChange = (fontType: "primaryFontFamily" | "secondaryFontFamily") => (value: string) => {
    setSiteDesignConfig((prevConfig) => ({
      ...prevConfig,
      [fontType]: value,
    }));
  };

  const updatePreferences = () => {
    saveSiteDesignConfig(config);
  };

  return (
    <div
      style={{
        background: "white",
        minWidth: "300px",
        padding: "20px",
        height: "100%",
        overflowY: "auto",
        scrollBehavior: "smooth",
        position: "fixed",
        right: "0"
      }}
    >
      <h1>Site Design</h1>
      <div style={{ border: "1px solid #EEE", padding: "10px 20px" }}>
        <h5>Colors</h5>
        <div className={styles.colorPicker}>
          <p>Accent</p>
          <ColorPicker
            value={config.accentColor}
            onChange={handleColorChange("accentColor")}
            size="small"
          />
        </div>
        <div className={styles.colorPicker}>
          <p>Background</p>
          <ColorPicker
            value={config.backgroundColor}
            onChange={handleColorChange("backgroundColor")}
            size="small"
          />
        </div>
        <div className={styles.colorPicker}>
          <p>Primary Font Color</p>
          <ColorPicker
            value={config.primaryFontColor}
            onChange={handleColorChange("primaryFontColor")}
            size="small"
          />
        </div>
        <div className={styles.colorPicker}>
          <p>Secondary Font Color</p>
          <ColorPicker
            value={config.secondaryFontColor}
            onChange={handleColorChange("secondaryFontColor")}
            size="small"
          />
        </div>
      </div>
      <div style={{ border: "1px solid #EEE", padding: "10px 20px", marginTop: "30px" }}>
        <h5>Fonts</h5>
        <div>
          <p>Primary Font</p>
          <Select
            options={fontOptions.map(font => ({
              ...font,
              label: <span style={{ fontFamily: font.value }}>{font.label}</span>
            }))}
            value={config.primaryFontFamily}
            onChange={handleFontChange("primaryFontFamily")}
            style={{ width: "100%" }}
            optionLabelProp="label"
          />
        </div>
        <div>
          <p>Secondary Font</p>
          <Select
            options={fontOptions.map(font => ({
              ...font,
              label: <span style={{ fontFamily: font.value }}>{font.label}</span>
            }))}
            value={config.secondaryFontFamily}
            onChange={handleFontChange("secondaryFontFamily")}
            style={{ width: "100%" }}
            optionLabelProp="label"
          />
        </div>
      </div>
      <Form.Item>
        <Button
          onClick={updatePreferences}
          style={{
            backgroundColor: "#3BAFDE",
            borderColor: "#3BAFDE",
            color: "white",
            marginTop: "20px",
          }}
        >
          Update Preferences
        </Button>
      </Form.Item>
    </div>
  );
};

export default SitedesignBuilder;
