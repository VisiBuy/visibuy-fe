import React from "react";
import { Form, Input, Button, Checkbox, Spin, notification } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../public/images/VisiBuy-White Colored 1.svg";
import lock from "../../public/icons/lock.svg";
import { useLoginMutation } from "@/features/auth/authApi";
import { LoginFormValues } from "@/types/types";

const LoginScreen = () => {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [api, contextHolder] = notification.useNotification();

  const showSuccessNotification = () => {
    api.success({
      message: (
        <span className="font-semibold text-green-900">Welcome back!</span>
      ),
      description: "Login successful! Redirecting to your dashboard...",
      placement: "topRight",
      icon: <CheckCircleOutlined className="text-green-500" />,
      className: "custom-success-notification",
      style: {
        background: "#f6ffed",
        border: "1px solid #b7eb8f",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
      },
      duration: 3,
    });
  };

  const showErrorNotification = (errorMessage: string) => {
    api.error({
      message: <span className="font-semibold text-red-900">Login Failed</span>,
      description: errorMessage,
      placement: "topRight",
      icon: <CloseCircleOutlined className="text-red-500" />,
      className: "custom-error-notification",
      style: {
        background: "#fff2f0",
        border: "1px solid #ffccc7",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
      },
      duration: 4,
    });
  };

  const onFinish = async (values: LoginFormValues & { remember?: boolean }) => {
    try {
      await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      showSuccessNotification();

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err: any) {
      let message = "Login failed. Please check your credentials and try again.";
      if (err?.data?.message) {
        message = err.data.message;
      } else if (err?.status === 401) {
        message = "Invalid email/phone or password. Please try again.";
      } else if (err?.status === 429) {
        message = "Too many failed attempts. Please try again later.";
      } else if (err?.status >= 500) {
        message = "Server error. Please try again later.";
      }
      showErrorNotification(message);
    }
  };

  const validateEmailOrPhone = (rule: any, value: string): Promise<void> => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[\d\s\-()]+$/;
    if (!value) {
      return Promise.reject(new Error("Please input your email or phone number!"));
    }
    if (!emailRegex.test(value) && !phoneRegex.test(value)) {
      return Promise.reject(new Error("Please enter a valid email address or phone number!"));
    }
    return Promise.resolve();
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

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center space-y-4 transform scale-105 transition-transform duration-300">
            <Spin indicator={loadingIcon} size="large" />
            <p className="text-gray-700 font-semibold animate-pulse">
              Signing you in...
            </p>
          </div>
        </div>
      )}

      <div className="hidden md:flex md:w-2/5 bg-primary-blue flex-col p-10 py-20 px-14 transition-standard fixed left-0 top-0 h-full overflow-y-auto">
        <div className="flex items-center space-x-2 text-white transform hover:scale-105 transition-transform duration-300">
          <img src={Logo} alt="logo" className="transition-all duration-300" draggable='false' />
        </div>

        <div className="flex gap-2 mt-20 items-center animate-fade-in-up">
          <img
            src={lock}
            alt="lock"
            className="w-[51px] h-[51px] transform hover:scale-110 transition-transform duration-300"
            draggable='false'
          />
          <div className="flex justify-center items-center">
            <h4 className="text-h5-desktop text-neutral-white font-semibold animate-pulse-slow">
              Login
            </h4>
          </div>
        </div>
      </div>

      <div className="w-full md:w-3/5 p-8 bg-white flex items-center justify-center animate-fade-in md:ml-[40%]">
        <div className="w-full max-w-[496px] transform transition-all duration-500 ease-in-out bg-white">
          <div className="md:hidden flex items-center space-x-space-8 text-primary-blue mb-space-32 justify-center animate-bounce-in">
            <img
              src={Logo}
              alt="logo"
              className="h-8 transform hover:scale-110 transition-transform duration-300"
            />
          </div>

          <div className="mb-space-32 text-center animate-fade-in-up">
            <h2 className="text-h2-desktop md:text-h2-mobile font-semibold text-neutral-900 mb-space-8 transform hover:scale-105 transition-standard tracking-[1%]">
              Welcome back!
            </h2>

            <p className="text-neutral-600 text-body-small font-regular animate-pulse-slow">
              Enter your details to sign in to your account
            </p>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            className="space-y-space-24 border border-neutral-300 rounded-card shadow-elevation-1 p-space-32 hover:shadow-elevation-2 transition-standard"
          >
            <Form.Item
              name="email"
              label={
                <span className="text-neutral-700 font-medium text-body-small transition-standard">
                  Email or Phone Number *
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please input your email or phone number!",
                },
              ]}
            >
              <Input
                suffix={
                  <MailOutlined className="text-neutral-400 transition-standard hover:text-primary-blue" />
                }
                placeholder="Enter your email or phone number"
                autoComplete="email"
                className="rounded-input transition-standard h-input hover:border-primary-blue focus:border-primary-blue focus:shadow-elevation-2"
                disabled={isLoading}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <span className="text-neutral-700 font-medium text-body-small transition-standard">
                  Password *
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
                {
                  min: 8,
                  message: "Password must be at least 8 characters!",
                },
              ]}
            >
              <Input.Password
                prefix={
                  <LockOutlined className="text-neutral-400 transition-standard hover:text-primary-blue" />
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone className="transition-standard hover:text-primary-blue" />
                  ) : (
                    <EyeInvisibleOutlined className="transition-standard hover:text-primary-blue" />
                  )
                }
                className="rounded-input transition-standard h-input hover:border-primary-blue focus:border-primary-blue focus:shadow-elevation-2"
                disabled={isLoading}
              />
            </Form.Item>

            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox
                  className="text-neutral-600 transition-standard hover:text-primary-blue"
                  disabled={isLoading}
                >
                  Remember me
                </Checkbox>
              </Form.Item>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                className="h-btn-medium rounded-btn-medium bg-primary-green border-primary-green hover:bg-primary-green/90 hover:border-primary-green/90 text-body-medium font-regular transform hover:scale-105 transition-standard shadow-elevation-2 hover:shadow-elevation-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-tap-target"
                disabled={isLoading}
                icon={isLoading ? <LoadingOutlined spin /> : null}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </Form.Item>

            <div className="text-center text-body-small space-y-space-12 animate-fade-in-up mt-space-24">
              <div>
                <span className="text-neutral-600 transition-standard">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-primary-blue hover:text-primary-blue/80 font-medium transition-standard transform hover:scale-105 inline-block"
                  >
                    Sign up
                  </Link>
                </span>
              </div>
              <div>
                <Link
                  to="/forgot-password"
                  className="text-primary-blue hover:text-primary-blue/80 font-medium transition-standard transform hover:scale-105 inline-block"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;