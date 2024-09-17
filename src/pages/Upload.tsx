import React, { useState } from "react";
import { Form, Upload, Button, message } from "antd";
import { RcFile } from "antd/lib/upload";
import { PlusOutlined } from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const UploadForm: React.FC = () => {
  const [form] = Form.useForm();
  const [tempUrl, setTempUrl] = useState<string>(''); // State to store the temporary URL
  const [imageUrl, setImageUrl] = useState<string>(''); // State to store the ImageKit URL
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const uploadImage = async (file: RcFile) => {
    const formData = new FormData();
    formData.append("file", file);
    console.log("Uploading file:", file); // Debug log

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Server response:", responseData);

      if (responseData.result) {
        setTempUrl(responseData.result.tempUrl); // Update tempUrl state with the temporary URL
        setImageUrl(responseData.result.url); // Update imageUrl state with the ImageKit URL
        message.success('File uploaded successfully');
        handleUpdate(responseData.result.url); // Call handleUpdate with the uploaded URL
        form.setFieldsValue({ imageUrl: responseData.result.url }); // Set the ImageKit URL in the form
      } else {
        message.error('Failed to get URLs from response');
      }
    } catch (error) {
      message.error('File upload failed');
      console.error("Error uploading file:", error);
    }
  };

  const handleUpdate = async (imageUrl: string) => {
    try {
      const response = await fetch('/api/updateProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
        }),
      });

      if (response.ok) {
        // Update session data after successful update
        message.success('Profile updated successfully');
      } else {
        message.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      message.error('Failed to update profile');
    }
  };

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1)); // Only keep the last uploaded file
  };

  return (
    <Form form={form}>
      <Form.Item name="imageUrl">
        <ImgCrop rotationSlider>
          <Upload
            customRequest={({ file }) => uploadImage(file as RcFile)}
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={(file) => window.open(file.url || '', '_blank')}
          >
            {fileList.length < 1 && '+ Upload'}
          </Upload>
        </ImgCrop>
      </Form.Item>
      <Form.Item>
        <div>
          <p>Temporary URL: {tempUrl}</p>
          <p>ImageKit URL: {imageUrl}</p>
        </div>
      </Form.Item>
    </Form>
  );
};

export default UploadForm;
