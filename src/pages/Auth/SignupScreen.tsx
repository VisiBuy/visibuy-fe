import React, { useState } from "react";
import { Form, Input, Button, message, Spin, notification } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  PhoneOutlined,
  LoadingOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../public/images/VisiBuy-White Colored 1.svg";
import lock from "../../public/icons/lock.svg";
import { useRegisterMutation } from "@/features/auth/authApi";
import { SignupFormValues } from "@/types/types";



const SignupScreen = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const showSuccessNotification = (name: string) => {
    api.success({
      message: (
        <span className="font-semibold text-green-900">Welcome aboard!</span>
      ),
      description: `Welcome ${name}! Your account has been created successfully. Redirecting...`,
      placement: 'topRight',
      icon: <CheckCircleOutlined className="text-green-500" />,
      className: "custom-success-notification",
      style: {
        background: "#f6ffed",
        border: "1px solid #b7eb8f",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(82, 196, 26, 0.2)",
      },
      duration: 3,
    });
  };

  const showErrorNotification = (errorMessage: string) => {
    api.error({
      message: (
        <span className="font-semibold text-red-900">Registration Failed</span>
      ),
      description: errorMessage,
      placement: 'topRight',
      icon: <CloseCircleOutlined className="text-red-500" />,
      className: "custom-error-notification",
      style: {
        background: "#fff2f0",
        border: "1px solid #ffccc7",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(255, 77, 79, 0.2)",
      },
      duration: 4,
    });
  };

  const onFinish = async (values: SignupFormValues) => {
    if (values.password !== values.confirmPassword) {
      showErrorNotification("Passwords do not match. Please try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      } as any).unwrap();

      showSuccessNotification(values.name);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err: any) {
      showErrorNotification(err?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadingIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
        color: "#28A745",
      }}
      spin
    />
  );

  return (
    <div className="min-h-screen flex transition-all duration-300 ease-in-out">
      {contextHolder}
      
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center space-y-4 transform scale-105 transition-transform duration-300">
            <Spin indicator={loadingIcon} size="large" />
            <p className="text-gray-700 font-semibold animate-pulse">
              Creating your account...
            </p>
          </div>
        </div>
      )}

      <div className="hidden md:flex md:w-2/5 bg-[#007AFF] flex-col p-10 py-20 px-14 transition-all duration-500 ease-out fixed left-0 top-0 h-full overflow-y-auto">
        <div className="flex items-center space-x-2 text-white transform hover:scale-105 transition-transform duration-300">
          <img src={Logo} alt="logo" className="transition-all duration-300" />
        </div>

        <div className="flex gap-2 mt-20 items-center animate-fade-in-up">
          <img
            src={lock}
            alt="lock"
            className="w-[51px] h-[51px] transform hover:scale-110 transition-transform duration-300"
          />
          <div className="flex justify-center items-center">
            <h4 className="text-xl text-white font-semibold animate-pulse-slow">
              Sign Up
            </h4>
          </div>
        </div>
      </div>

      <div className="w-full md:w-3/5 p-8 bg-white flex items-center justify-center animate-fade-in md:ml-[40%]">
        <div className="w-full max-w-[496px] transform transition-all duration-500 ease-in-out bg-white">
          <div className="md:hidden flex items-center space-x-2 text-[#007AFF] mb-8 justify-center animate-bounce-in">
            <img
              src={Logo}
              alt="logo"
              className="h-8 transform hover:scale-110 transition-transform duration-300"
            />
          </div>

          <div className="mb-8 text-center animate-fade-in-up">
            <h2 className="text-3xl font-semibold text-gray-900 mb-2 transform hover:scale-105 transition-transform duration-300 tracking-[1%]">
              Create your account.
            </h2>
            <p className="text-gray-600 text-sm font-[400] animate-pulse-slow">
              Shop with certainty using VisiBuy.
            </p>
          </div>

          <Form
            form={form}
            name="signup"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            className="space-y-6 border border-[#E3E3E3] rounded-2xl shadow-sm p-8 hover:shadow-sm"
          >
            <Form.Item
              name="name"
              label={
                <span className="text-gray-700 font-medium transition-colors duration-300">
                  Full Name *
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please input your full name!",
                },
                {
                  min: 2,
                  message: "Name must be at least 2 characters!",
                },
              ]}
            >
              <Input
                suffix={
                  <UserOutlined className="text-gray-400 transition-colors duration-300 hover:text-[#007AFF]" />
                }
                placeholder="Enter your full name"
                className="rounded-lg transition-all duration-300 h-[51px] hover:border-[#007AFF] focus:border-[#007AFF] focus:shadow-lg"
                disabled={isLoading}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={
                <span className="text-gray-700 font-medium transition-colors duration-300">
                  Organization Email *
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please input your organization email!",
                },
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
              ]}
            >
              <Input
                suffix={
                  <MailOutlined className="text-gray-400 transition-colors duration-300 hover:text-[#007AFF]" />
                }
                placeholder="Enter your organization email"
                className="rounded-lg transition-all h-[51px] duration-300 hover:border-[#007AFF] focus:border-[#007AFF] focus:shadow-lg"
                disabled={isLoading}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label={
                <span className="text-gray-700 font-medium transition-colors duration-300">
                  Phone Number *
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please input your phone number!",
                },
                {
                  pattern: /^[+]?[\d\s\-()]+$/,
                  message: "Please enter a valid phone number (e.g. +2348012345678)."
                },
              ]}
            >
              <Input
                suffix={
                  <PhoneOutlined className="text-gray-400 transition-colors duration-300 hover:text-[#007AFF]" />
                }
                placeholder="Enter your phone number"
                className="rounded-lg transition-all h-[51px] duration-300 hover:border-[#007AFF] focus:border-[#007AFF] focus:shadow-lg"
                disabled={isLoading}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <span className="text-gray-700 font-medium transition-colors duration-300">
                  Password *
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
                {
                  min: 6,
                  message: "Password must be at least 6 characters!",
                },
              ]}
            >
              <Input.Password
                placeholder="Enter your password"
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone className="transition-colors duration-300 hover:text-[#007AFF]" />
                  ) : (
                    <EyeInvisibleOutlined className="transition-colors duration-300 hover:text-[#007AFF]" />
                  )
                }
                className="rounded-lg transition-all h-[51px] duration-300 hover:border-[#007AFF] focus:border-[#007AFF] focus:shadow-lg"
                disabled={isLoading}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={
                <span className="text-gray-700 font-medium transition-colors duration-300">
                  Confirm Password *
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirm your password"
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone className="transition-colors duration-300 hover:text-[#007AFF]" />
                  ) : (
                    <EyeInvisibleOutlined className="transition-colors duration-300 hover:text-[#007AFF]" />
                  )
                }
                className="rounded-lg transition-all h-[51px] duration-300 hover:border-[#007AFF] focus:border-[#007AFF] focus:shadow-lg"
                disabled={isLoading}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                className="h-12 rounded-lg bg-[#28A745] border-[#28A745] hover:bg-green-600 hover:border-green-600 text-base font-[400] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading}
                icon={isLoading ? <LoadingOutlined spin /> : null}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center text-sm space-y-3 animate-fade-in-up mt-6">
            <div>
              <span className="text-gray-600 transition-colors duration-300">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#007AFF] hover:text-blue-700 font-medium transition-colors duration-300 transform hover:scale-105 inline-block"
                >
                  Sign in
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;