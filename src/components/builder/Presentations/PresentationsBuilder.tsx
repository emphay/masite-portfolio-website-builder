import { Button, Dropdown, Input, Menu, message, Segmented, Switch } from "antd";
import React, { useState } from "react";
import { MenuOutlined, AppstoreOutlined, MoreOutlined } from "@ant-design/icons";
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
const { TextArea } = Input;

dayjs.extend(customParseFormat);

export interface Presentation {
  presentationTitle: string;
  presentationLink: string;
  presentationDescription: string;
  dateOfPresentation: Date | null;
}

export interface PresentationConfig {
  id: string;
  presentations: Presentation[];
  presentationDisplayLayout: string;
  presentationThumbnail: string;
  primaryFontColor: string;
  primaryFontFamily: string;
  secondaryFontColor: string;
  secondaryFontFamily: string;
}

const PresentationBuilder: React.FC<{
  config: PresentationConfig;
  setPresentationConfig: React.Dispatch<React.SetStateAction<PresentationConfig | undefined>>;
  savePresentationConfig: (presentationConfig: PresentationConfig) => void;
}> = ({ config, setPresentationConfig, savePresentationConfig }) => {

  const dateFormat = 'YYYY-MM-DD';
  const today = dayjs();

  const presentations = config.presentations || [];

  const [presentationTitle, setPresentationTitle] = useState<string>("");
  const [presentationLink, setPresentationLink] = useState<string>("");
  const [presentationDescription, setPresentationDescription] = useState<string>("");
  const [dateOfPresentation, setDateOfPresentation] = useState<Date | null>(null);
  const [layout, setLayout] = useState<string>(config.presentationDisplayLayout || "Grid");
  const [thumbnailSwitch, setThumbnailSwitch] = useState<string>(config.presentationThumbnail ? "ON" : "OFF");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleLayoutChange = (value: string) => {
    setLayout(value);
    setPresentationConfig({
      ...config,
      presentationDisplayLayout: value,
    });
  };

  const handleThumbnailSwitchChange = (checked: boolean) => {
    const newState = checked ? "ON" : "OFF";
    setThumbnailSwitch(newState);
    setPresentationConfig({
      ...config,
      presentationThumbnail: newState === "ON" ? "ON" : "OFF",
    });
  };

  const handleSave = () => {
    if (!presentationTitle || !presentationLink || !dateOfPresentation) {
      message.error("Something Missing: Please add the Presentation Title or Link or the date of Presentation.");
      return;
    }

    const newPresentation: Presentation = {
      presentationTitle,
      presentationLink,
      presentationDescription,
      dateOfPresentation,
    };

    const updatedPresentations = [...presentations];
    if (editingIndex !== null) {
      updatedPresentations[editingIndex] = newPresentation;
    } else {
      updatedPresentations.push(newPresentation);
    }

    const updatedConfig: PresentationConfig = {
      ...config,
      presentations: updatedPresentations,
    };

    setPresentationConfig(updatedConfig);
    savePresentationConfig(updatedConfig);

    setEditingIndex(null);
    clearFormFields();
  };

  const handleDelete = async (presentationLink: string) => {
    try {
      const response = await fetch('/api/savePresentationData', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ presentationLink }),
      });

      if (response.ok) {
        const updatedPresentations = presentations.filter(
          presentation => presentation.presentationLink !== presentationLink
        );

        const updatedConfig: PresentationConfig = {
          ...config,
          presentations: updatedPresentations,
        };

        setPresentationConfig(updatedConfig);
        savePresentationConfig(updatedConfig);
      } else {
        console.error('Failed to delete the presentation');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (presentation: Presentation, index: number) => {
    setEditingIndex(index);
    setPresentationTitle(presentation.presentationTitle);
    setPresentationLink(presentation.presentationLink);
    setPresentationDescription(presentation.presentationDescription);
    setDateOfPresentation(presentation.dateOfPresentation);
  };

  const clearFormFields = () => {
    setPresentationTitle("");
    setPresentationLink("");
    setPresentationDescription("");
    setDateOfPresentation(null);
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current > today;
  };
  const handlePreferences = () => {
    // Update the configuration with the selected layout and thumbnail settings
    const updatedConfig: PresentationConfig = {
      ...config,
      presentationDisplayLayout: layout,
      presentationThumbnail: thumbnailSwitch === "ON" ? "ON" : "OFF",
    };

    // Update the state and save the updated configuration
    setPresentationConfig(updatedConfig);
    savePresentationConfig(updatedConfig);

    // Provide feedback to the user
    message.success("Preferences updated successfully!");
  };


  return (
    <div style={{
      background: "white", width: "18vw", minWidth: "300px", padding: "20px", height: "100vh",
      overflowY: "auto",
      scrollBehavior: "smooth",
      position: "fixed",
      right: "0"
    }}>
      <h1 style={{ fontSize: "20px" }}>Presentations</h1>

      <div style={{ border: "1px solid #eee", padding: "10px 20px", marginTop: "30px" }}>
        <h3>Details</h3>

        {presentations.length > 0 ? (
          presentations.map((presentation, index) => {
            const menu = (
              <Menu>
                <Menu.Item key="edit" onClick={() => handleEdit(presentation, index)}>
                  Edit
                </Menu.Item>
                <Menu.Item key="delete" onClick={() => handleDelete(presentation.presentationLink)}>
                  Delete
                </Menu.Item>
              </Menu>
            );

            return (
              <div key={index} style={{ marginBottom: "15px", border: "1px solid #ccc", padding: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>{presentation.presentationTitle}</div>
                  <Dropdown overlay={menu} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                  </Dropdown>
                </div>
              </div>
            );
          })
        ) : (
          <p>No presentations found.</p>
        )}

        <Input
          placeholder="My first talk"
          value={presentationTitle}
          onChange={(e) => setPresentationTitle(e.target.value)}
        />
        <p>Link</p>
        <Input
          placeholder="https://example.com"
          value={presentationLink}
          onChange={(e) => setPresentationLink(e.target.value)}
        />
        <p>Description</p>
        <TextArea
          rows={4}
          value={presentationDescription}
          onChange={(e) => setPresentationDescription(e.target.value)}
        />
        <p>Date of Talk</p>
        <DatePicker
          value={dateOfPresentation ? dayjs(dateOfPresentation) : null}
          onChange={(date) => setDateOfPresentation(date ? date.toDate() : null)}
          format={dateFormat}
          disabledDate={disabledDate}
        />
        <Button onClick={handleSave} style={{ marginTop: "10px" }}>
          {editingIndex !== null ? "Update" : "Save"}
        </Button>
      </div>

      <div style={{ border: "1px solid #eee", padding: "10px 20px", marginTop: "30px" }}>
        <h3>Design</h3>
        <p>Display Layout</p>
        <Segmented
          options={[
            { label: <><MenuOutlined /> Grid</>, value: 'Grid' },
            { label: <><AppstoreOutlined /> Card</>, value: 'Card' },
          ]}
          value={layout}
          onChange={(value) => handleLayoutChange(value as string)}
          style={{ border: "none", fontSize: "13px" }}
        />
        <p style={{ marginTop: "25px" }}>Show Thumbnail</p>
        <Switch
          checked={thumbnailSwitch === "ON"}
          onChange={handleThumbnailSwitchChange}
        />
        <p>Thumbnail State: {thumbnailSwitch}</p>
      </div>

      <div>
        <Button
          type="primary"
          onClick={handlePreferences}
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

export default PresentationBuilder;
