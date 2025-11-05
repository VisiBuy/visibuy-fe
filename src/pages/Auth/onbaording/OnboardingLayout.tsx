import React, { useState } from "react";
import { Card, Button, Form, Input, Upload, message } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  ShopOutlined,
  UploadOutlined,
  CarOutlined,
  ShoppingCartOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import Sidebar from "./Sidebar";

const { TextArea } = Input;

const OnboardingLayout: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  const uploadProps = {
    beforeUpload: (file: File) => {
      const isValid = ["image/jpeg", "image/png"].includes(file.type);
      if (!isValid) message.error("Only JPG/PNG files are allowed!");
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) message.error("File must be smaller than 2MB!");
      return false;
    },
  };

  const handleSubmit = (values: any) => {
    console.log("✅ Submitted values:", values);
    message.success("Information saved successfully!");
  };

  const renderForm = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "Please enter your first name" }]}
            >
              <Input placeholder="First Name" prefix={<UserOutlined />} size="large" />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: "Please enter your last name" }]}
            >
              <Input placeholder="Last Name" prefix={<UserOutlined />} size="large" />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[
                {
                  required: true,
                  pattern: /^\+\d{10,15}$/,
                  message: "Please enter a valid phone number (e.g. +2348012345678)",
                },
              ]}
            >
              <Input placeholder="+2348012345678" prefix={<PhoneOutlined />} size="large" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Contact Address"
              rules={[{ required: true, message: "Please enter your address" }]}
            >
              <Input placeholder="Enter your address" prefix={<HomeOutlined />} size="large" />
            </Form.Item>
            <Form.Item name="email" label="Email (Optional)">
              <Input placeholder="your.email@example.com" prefix={<MailOutlined />} size="large" />
            </Form.Item>
            <div className="md:col-span-2 flex justify-end">
              <Button type="primary" htmlType="submit" className="bg-green-600 px-8" size="large">
                Save & Continue
              </Button>
            </div>
          </Form>
        );
      case 1:
        return (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Form.Item
              name="businessName"
              label="Business Name"
              rules={[{ required: true, message: "Please enter business name" }]}
            >
              <Input placeholder="Business name" prefix={<ShopOutlined />} size="large" />
            </Form.Item>
            <Form.Item
              name="businessPhone"
              label="Business Phone"
              rules={[{ required: true, message: "Please enter business phone" }]}
            >
              <Input placeholder="Phone number" prefix={<PhoneOutlined />} size="large" />
            </Form.Item>
            <Form.Item
              name="businessAddress"
              label="Business Address"
              className="md:col-span-2"
              rules={[{ required: true, message: "Please enter business address" }]}
            >
              <TextArea rows={3} placeholder="Full business address" />
            </Form.Item>
            <Form.Item name="businessLogo" label="Business Logo" className="md:col-span-2">
              <Upload {...uploadProps} listType="picture" maxCount={1}>
                <Button icon={<UploadOutlined />} size="large">
                  Upload Logo
                </Button>
              </Upload>
            </Form.Item>
            <div className="md:col-span-2 flex justify-end">
              <Button type="primary" htmlType="submit" className="bg-green-600 px-8" size="large">
                Save & Continue
              </Button>
            </div>
          </Form>
        );
      case 2:
        return (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Form.Item
              name="riderName"
              label="Rider Full Name"
              rules={[{ required: true, message: "Please enter rider name" }]}
            >
              <Input placeholder="Rider full name" prefix={<UserOutlined />} size="large" />
            </Form.Item>
            <Form.Item
              name="vehicleType"
              label="Vehicle Type"
              rules={[{ required: true, message: "Please enter vehicle type" }]}
            >
              <Input placeholder="Motorcycle / Car" prefix={<CarOutlined />} size="large" />
            </Form.Item>
            <Form.Item
              name="licenseNumber"
              label="License Number"
              rules={[{ required: true, message: "Please enter license number" }]}
              className="md:col-span-2"
            >
              <Input placeholder="Driver's license number" prefix={<IdcardOutlined />} size="large" />
            </Form.Item>
            <div className="md:col-span-2 flex justify-end">
              <Button type="primary" htmlType="submit" className="bg-green-600 px-8" size="large">
                Save & Continue
              </Button>
            </div>
          </Form>
        );
      case 3:
        return (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Form.Item
              name="storeName"
              label="Store Name"
              rules={[{ required: true, message: "Please enter your store name" }]}
            >
              <Input placeholder="Store name" prefix={<ShoppingCartOutlined />} size="large" />
            </Form.Item>
            <Form.Item
              name="storeLocation"
              label="Store Location"
              rules={[{ required: true, message: "Please enter location" }]}
            >
              <Input placeholder="Store address" prefix={<EnvironmentOutlined />} size="large" />
            </Form.Item>
            <Form.Item name="storeBanner" label="Store Banner" className="md:col-span-2">
              <Upload {...uploadProps} listType="picture" maxCount={1}>
                <Button icon={<UploadOutlined />} size="large">
                  Upload Banner
                </Button>
              </Upload>
            </Form.Item>
            <div className="md:col-span-2 flex justify-end">
              <Button type="primary" htmlType="submit" className="bg-green-600 px-8" size="large">
                Complete Setup
              </Button>
            </div>
          </Form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Let’s get you started!</h1>
        <p className="text-gray-500 mt-2 text-lg">Please fill in the forms.</p>
      </div>

      <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden max-w-6xl w-full">
        <Sidebar currentStep={currentStep} setCurrentStep={setCurrentStep} />
        <div className="flex-1 p-10">
          <Card bordered={false} className="shadow-none">
            {renderForm()}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
