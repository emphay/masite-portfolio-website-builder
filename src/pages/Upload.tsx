import React, { useState } from "react";
import { Form, Upload, message } from "antd";
import ImgCrop from "antd-img-crop";
import { RcFile, UploadFile } from "antd/lib/upload";

const UploadForm: React.FC = () => {
  const [form] = Form.useForm();
  const [tempLink, setTempLink] = useState<string>(""); // Temporary URL
  const [s3Link, setS3Link] = useState<string>(""); // S3 URL

  const handleFileUpload = async (file: RcFile) => {
    try {
      // Generate and set the temporary link for preview
      const tempUrl = URL.createObjectURL(file);
      setTempLink(tempUrl);

      // Convert file to base64 string
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result?.toString().split(",")[1];

        // Upload to the API, which uploads to S3
        const response = await fetch("/api/uploadProfileImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file: base64,
            fileName: file.name,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setS3Link(data.url); // Set the S3 URL in the state
          setFileList(prev => [
            { uid: "-1", url: data.url, name: "image" },
          ]);
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
    { uid: "-1", url: s3Link, name: "image" },
  ]);

  const handleImageUpload = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  return (
    <Form form={form}>
      <Form.Item>
        <ImgCrop rotationSlider>
          <Upload
            customRequest={({ file }) => handleFileUpload(file as RcFile)}
            listType="picture-card"
            fileList={fileList}
            onChange={handleImageUpload}
          >
            {fileList.length < 1 && "+ Upload"}
          </Upload>
        </ImgCrop>
      </Form.Item>
      <Form.Item>
        <div>
          <p>Temporary Link: <a href={tempLink} target="_blank" rel="noopener noreferrer">{tempLink}</a></p>
          <p>S3 Bucket Link: <a href={s3Link} target="_blank" rel="noopener noreferrer">{s3Link}</a></p>
        </div>
      </Form.Item>
    </Form>
  );
};

export default UploadForm;
