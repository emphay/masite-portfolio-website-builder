import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import ImgCrop from "antd-img-crop";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import TextArea from "antd/lib/input/TextArea";
import { UploadRequestOption } from "rc-upload/lib/interface";

export interface AboutConfig {
  id: string;
  image: string;
  displayName: string;
  title: string;
  description: string;
  instagramLink: string;
  linkedinLink: string;
  githubLink: string;
  youtubeLink: string;
  accentColor: string;
  backgroundColor: string;
  primaryFontColor: string;
  primaryFontFamily: string;
  secondaryFontColor: string;
  secondaryFontFamily: string;
}

const AboutBuilder: React.FC<{
  config: AboutConfig;
  setAboutConfig: React.Dispatch<React.SetStateAction<AboutConfig>>;
  saveAboutConfig: (config: AboutConfig) => void;
}> = ({ config, setAboutConfig, saveAboutConfig }) => {
  const handleSocialMediaLinks = (platform: string, username: string) => {
    let newLink = "";
    switch (platform) {
      case "Instagram":
        newLink = `https://instagram.com/${username}`;
        setAboutConfig(prev => ({ ...prev, instagramLink: newLink }));
        break;
      case "LinkedIn":
        newLink = `https://linkedin.com/in/${username}`;
        setAboutConfig(prev => ({ ...prev, linkedinLink: newLink }));
        break;
      case "Github":
        newLink = `https://github.com/${username}`;
        setAboutConfig(prev => ({ ...prev, githubLink: newLink }));
        break;
      case "YouTube":
        newLink = `https://youtube.com/@${username}`;
        setAboutConfig(prev => ({ ...prev, youtubeLink: newLink }));
        break;
      default:
        break;
    }
  };

  const extractUsername = (url: string) => {
    if (!url) return "";
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");

      switch (urlObj.hostname) {
        case "instagram.com":
          return pathParts[1] || "";
        case "linkedin.com":
          return pathParts[2] || pathParts[1] || "";
        case "github.com":
          return pathParts[1] || "";
        case "youtube.com":
          return pathParts[1].startsWith("@") ? pathParts[1].slice(1) : pathParts[2] || "";
        default:
          return "";
      }
    } catch (e) {
      console.error("Invalid URL:", url, e);
      return "";
    }
  };

  const [form] = Form.useForm();
  const [tempLink, setTempLink] = useState<string>("");
  const [s3Link, setS3Link] = useState<string>(config.image || "");

  const handleFileUpload = async (file: RcFile) => {
    try {
      const tempUrl = URL.createObjectURL(file);
      setFileList([{ uid: "-1", url: tempUrl, name: file.name, status: "uploading" }]);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result?.toString().split(",")[1];

        const response = await fetch("/api/uploadProfileImage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: base64, fileName: file.name }),
        });

        if (response.ok) {
          const data = await response.json();
          const newS3Link = data.url;
          setFileList([{ uid: "-1", url: newS3Link, name: "image", status: "done" }]);
          setAboutConfig(prev => ({ ...prev, image: newS3Link }));

          message.success("File uploaded to S3 successfully");
        } else {
          throw new Error("Failed to upload file");
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("File upload failed");
    }
  };

  const [fileList, setFileList] = useState<UploadFile[]>([
    { uid: "-1", url: s3Link || config.image, name: "image" },
  ]);

  const handleImageUpload = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  const handleUpdateInfo = () => {
    saveAboutConfig(config);
  };

  const [instagramUsername, setInstagramUsername] = useState(
    extractUsername(config.instagramLink)
  );
  const [linkedinUsername, setLinkedinUsername] = useState(
    extractUsername(config.linkedinLink)
  );
  const [githubUsername, setGithubUsername] = useState(
    extractUsername(config.githubLink)
  );
  const [youtubeUsername, setYoutubeUsername] = useState(
    extractUsername(config.youtubeLink)
  );

  useEffect(() => {
    handleSocialMediaLinks("Instagram", instagramUsername);
  }, [instagramUsername]);

  useEffect(() => {
    handleSocialMediaLinks("LinkedIn", linkedinUsername);
  }, [linkedinUsername]);

  useEffect(() => {
    handleSocialMediaLinks("Github", githubUsername);
  }, [githubUsername]);

  useEffect(() => {
    handleSocialMediaLinks("YouTube", youtubeUsername);
  }, [youtubeUsername]);

  return (
    <div
      style={{
        background: "white",
        width: "18vw",
        minWidth: "200px",
        padding: "20px",
        height: "100vh",
        overflowY: "auto",
        scrollBehavior: "smooth",
        position: "fixed",
        right: "0"
      }}
    >
      <h1 style={{ fontSize: "20px" }}>About</h1>
      <div
        style={{
          border: "1px solid #eee",
          padding: "10px 20px",
          marginTop: "30px",
        }}
      >
        <h3>Basic Information</h3>
        <p>Profile Image</p>
        <Form>
          <Form.Item name="imageUrl">
            <ImgCrop rotationSlider>
              <Upload
                customRequest={({ file }) => handleFileUpload(file as RcFile)}
                listType="picture-card"
                fileList={fileList}
                onChange={handleImageUpload}
              >
                {fileList.length < 1 && "+"}
              </Upload>
            </ImgCrop>
          </Form.Item>
        </Form>
        <p>Display Name</p>
        <Input
          value={config.displayName}
          onChange={(e) => {
            setAboutConfig({ ...config, displayName: e.currentTarget.value });
          }}
        />
        <p>Title</p>
        <Input
          value={config.title}
          onChange={(e) => {
            setAboutConfig({ ...config, title: e.currentTarget.value });
          }}
        />
        <p>Description</p>
        <TextArea
          rows={4}
          value={config.description}
          onChange={(e) => {
            setAboutConfig({ ...config, description: e.currentTarget.value });
          }}
        />
      </div>
      <div
        style={{
          border: "1px solid #eee",
          padding: "10px 20px",
          marginTop: "30px",
        }}
      >
        <h3>Social Links</h3>
        <p>Instagram</p>
        <Input
          placeholder="@username"
          value={instagramUsername}
          onChange={(e) => setInstagramUsername(e.target.value)}
        />
        <p>LinkedIn</p>
        <Input
          placeholder="username"
          value={linkedinUsername}
          onChange={(e) => setLinkedinUsername(e.target.value)}
        />
        <p>GitHub</p>
        <Input
          placeholder="username"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
        />
        <p>YouTube</p>
        <Input
          placeholder="@username"
          value={youtubeUsername}
          onChange={(e) => setYoutubeUsername(e.target.value)}
        />
      </div>
      <div>
        <Button type="primary" onClick={handleUpdateInfo}
          style={{
            backgroundColor: "#3BAFDE",
            borderColor: "#3BAFDE",
            color: "white",
            marginTop: "20px"
          }}
        >
          Update Profile
        </Button>
      </div>
    </div>
  );
};

export default AboutBuilder;
