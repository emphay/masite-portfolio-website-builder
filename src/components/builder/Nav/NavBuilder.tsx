import React, { useEffect, useState } from "react";
import { Form, Input, Button, Layout } from "antd";
import styles from "../../../styles/sitebuilder.module.css";
import { Select } from 'antd';
import { PhoneOutlined, MailOutlined, WhatsAppOutlined } from '@ant-design/icons';

const { Sider } = Layout;
interface NavBuilderProps {
  id: string;
  FirstName: string;
  LastName: string;
  AboutNav: string;
  ArticleNav: string;
  ProjectNav: string;
  PresentationNav: string;
  ContactType: string;
  ContactValue: string;
  handleNavConfigUpdate: (conf: NavConfig) => void;
}

export interface NavConfig {
  id: string;
  firstName: string;
  lastName: string;
  aboutText: string;
  articleText: string;
  projectText: string;
  presentationText: string;
  contactType: string;
  contactValue: string;
  accentColor: string;
  backgroundColor: string;
  primaryFontColor: string;
  primaryFontFamily: string;
  secondaryFontColor: string;
  secondaryFontFamily: string;
}
const contactOptions = [
  { label: 'WhatsApp', value: 'WhatsApp', icon: <WhatsAppOutlined /> },
  {
    label: 'Telegram', value: 'Telegram', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15">
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m14.5 1.5l-14 5l4 2l6-4l-4 5l6 4z" />
      </svg>
    )
  },
  { label: 'Email', value: 'Email', icon: <MailOutlined /> },
  { label: 'Phone', value: 'Phone', icon: <PhoneOutlined /> },
];

const NavBuilder: React.FC<{
  config: NavConfig;
  setNavConfig: React.Dispatch<React.SetStateAction<NavConfig>>;
  saveNavConfig: (navConfig: NavConfig) => void;
}> = ({ config, setNavConfig, saveNavConfig }) => {
  // const [navData, setNavData] = useState<NavConfig>(config);
  const [selectedContact, setSelectedContact] = useState(config.contactType);

  const handleChange = (value: string) => {
    setSelectedContact(value);
    let contactLink = '';

    switch (value) {
      case 'whatsapp':
        contactLink = 'https://wa.me/1XXXXXXXXXX';
        break;
      case 'telegram':
        contactLink = 'https://t.me/+917255851994';
        break;
      case 'email':
        contactLink = 'mailto:mail@mail.com';
        break;
      case 'phone':
        contactLink = 'tel:+917255851994';
        break;
      default:
        contactLink = '';
    }

    setNavConfig({
      ...config,
      contactType: value,
      contactValue: contactLink,
    });
  };

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
      <h1 style={{ fontSize: "20px" }}>Navigation</h1>
      <div
        style={{
          border: "1px solid #eee",
          padding: "10px 20px",
          marginTop: "30px",
        }}
      >
        <h3>Display Name</h3>
        <Form.Item>
          <p>First Name</p>
          <Input
            value={config.firstName}
            onChange={(e) => {
              console.log(e.currentTarget.value);
              setNavConfig({ ...config, firstName: e.currentTarget.value });
            }}
          />
        </Form.Item>
        <Form.Item>
          <p>Last Name</p>
          <Input
            value={config.lastName}
            onChange={(e) =>
              setNavConfig({ ...config, lastName: e.currentTarget.value })
            }
          />
        </Form.Item>
      </div>
      <div
        style={{
          border: "1px solid #eee",
          padding: "10px 20px",
          marginTop: "30px",
        }}
      >
        <h3>Navigation Links</h3>
        <Form.Item>
          <p>#about</p>
          <Input
            value={config.aboutText}
            onChange={(e) =>
              setNavConfig({ ...config, aboutText: e.currentTarget.value })
            }
          />
        </Form.Item>
        <Form.Item>
          <p>#articles</p>
          <Input
            value={config.articleText}
            onChange={(e) =>
              setNavConfig({ ...config, articleText: e.currentTarget.value })
            }
          />
        </Form.Item>
        <Form.Item>
          <p>#projects</p>
          <Input
            value={config.projectText}
            onChange={(e) =>
              setNavConfig({ ...config, projectText: e.currentTarget.value })
            }
          />
        </Form.Item>
        <Form.Item>
          <p>#presentations</p>
          <Input
            value={config.presentationText}
            onChange={(e) =>
              setNavConfig({
                ...config,
                presentationText: e.currentTarget.value,
              })
            }
          />
        </Form.Item>
      </div>
      <div
        style={{
          border: "1px solid #eee",
          padding: "10px 20px",
          marginTop: "30px",
        }}
      >
        <h3>Contacts Button</h3>
        <Form.Item>
          <p>
            <Select
              value={selectedContact}
              onChange={handleChange}
              placeholder="Select Contact Type"
              style={{ width: '100%' }}
              optionLabelProp="label"
            >
              {contactOptions.map(option => (
                <Select.Option key={option.value} value={option.value} label={option.label}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {option.icon}
                    <span style={{ marginLeft: '8px' }}>{option.label}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </p>

          <Input
            placeholder="Activity"
            value={config.contactValue}
            onChange={(e) =>
              setNavConfig({ ...config, contactValue: e.currentTarget.value })
            }
          />
        </Form.Item>
      </div>
      <div>
        <Button type="primary" onClick={(e) => saveNavConfig(config)}
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

export default NavBuilder;
