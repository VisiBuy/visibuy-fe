import React, { useState } from "react";
import { Form, Input, Button, Spin, notification } from "antd";
import {
  MailOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../public/images/VisiBuy-White Colored 1.svg";
import lock from "../../public/icons/lock.svg";
import { ForgotPasswordFormValues } from "@/types/types";
import { useForgotPasswordMutation } from "@/features/auth/authApi";

const ForgotPasswordScreen = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [api, contextHolder] = notification.useNotification();
  
  const [forgotPassword] = useForgotPasswordMutation();

  const showSuccessNotification = (email: string) => {
    api.success({
      message: (
        <span className="font-semibold text-green-900">Reset Link Sent!</span>
      ),
      description: `Password reset instructions have been sent to ${email}. Check your email and click the link to reset your password.`,
      placement: "topRight",
      icon: <CheckCircleOutlined className="text-green-500" />,
      className: "custom-success-notification",
      style: {
        background: "#f6ffed",
        border: "1px solid #b7eb8f",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(82, 196, 26, 0.2)",
      },
      duration: 8,
    });
  };

  const showErrorNotification = (errorMessage: string) => {
    api.error({
      message: <span className="font-semibold text-red-900">Reset Failed</span>,
      description: errorMessage,
      placement: "topRight",
      icon: <CloseCircleOutlined className="text-red-500" />,
      className: "custom-error-notification",
      style: {
        background: "#fff2f0",
        border: "1px solid #ffccc7",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(255, 77, 79, 0.2)",
      },
      duration: 6,
    });
  };

  const onFinish = async (values: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await forgotPassword({
        email: values.email
      }).unwrap();

      setUserEmail(values.email);
      setResetEmailSent(true);
      showSuccessNotification(values.email);

      console.log('Reset password response:', response);

    } catch (err: any) {
      const errorMessage = err?.data?.message || 
                          err?.error || 
                          "Failed to send reset link. Please try again.";
      showErrorNotification(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendLink = () => {
    if (userEmail) {
      onFinish({ email: userEmail });
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

  // Success State - After email is sent
  if (resetEmailSent) {
    return (
      <div className="min-h-screen flex transition-all duration-300 ease-in-out">
        {contextHolder}

        <div className="hidden md:flex md:w-2/5 bg-[#007AFF] flex-col p-10 py-20 px-14 transition-all duration-500 ease-out">
          <div className="flex items-center space-x-2 text-white transform hover:scale-105 transition-transform duration-300">
            <img src={Logo} alt="logo" className="transition-all duration-300" draggable='false'/>
          </div>

          <div className="flex gap-2 mt-20 items-center animate-fade-in-up">
            <img
              src={lock}
              alt="lock"
              draggable='false'
              className="w-[51px] h-[51px] transform hover:scale-110 transition-transform duration-300"
            />
            <div className="flex justify-center items-center">
              <h4 className="text-xl text-white font-semibold animate-pulse-slow">
                Check Your Email
              </h4>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/5 p-8 bg-white flex items-center justify-center animate-fade-in">
          <div className="w-full max-w-[496px] transform transition-all duration-500 ease-in-out bg-white">
            <div className="md:hidden flex items-center space-x-2 text-[#007AFF] mb-8 justify-center animate-bounce-in">
              <img
                src={Logo}
                alt="logo"
                className="h-8 transform hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div className="mb-8 text-center animate-fade-in-up">
              <CheckCircleOutlined className="text-green-500 text-5xl mb-4" />
              <h2 className="text-3xl font-semibold text-gray-900 mb-2 transform hover:scale-105 transition-transform duration-300 tracking-[1%]">
                Check Your Email
              </h2>

              <p className="text-gray-600 text-sm font-[400] mb-4">
                We've sent a password reset link to:
              </p>
              <p className="text-gray-800 font-semibold mb-6">{userEmail}</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-[#007AFF] text-sm">
                <strong>Click the link in the email</strong> to set a new password for your account.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-gray-500 text-xs">
                  Didn't receive the email? Check your spam folder or
                </p>
                <Button
                  type="link"
                  onClick={handleResendLink}
                  loading={isSubmitting}
                  className="text-[#007AFF] hover:text-blue-700 font-medium"
                >
                  {isSubmitting ? "Sending..." : "Resend reset link"}
                </Button>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="text-[#007AFF] hover:text-blue-700 font-medium transition-colors duration-300"
              >
                ← Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original Form State
  return (
    <div className="min-h-screen flex transition-all duration-300 ease-in-out">
      {contextHolder}

      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center space-y-4 transform scale-105 transition-transform duration-300">
            <Spin indicator={loadingIcon} size="large" />
            <p className="text-gray-700 font-semibold animate-pulse">
              Sending reset link...
            </p>
          </div>
        </div>
      )}

      <div className="hidden md:flex md:w-2/5 bg-[#007AFF] flex-col p-10 py-20 px-14 transition-all duration-500 ease-out">
        <div className="flex items-center space-x-2 text-white transform hover:scale-105 transition-transform duration-300">
          <img src={Logo} alt="logo" className="transition-all duration-300" draggable='false'/>
        </div>

        <div className="flex gap-2 mt-20 items-center animate-fade-in-up">
          <img
            src={lock}
            alt="lock"
            draggable='false'
            className="w-[51px] h-[51px] transform hover:scale-110 transition-transform duration-300"
          />
          <div className="flex justify-center items-center">
            <h4 className="text-xl text-white font-semibold animate-pulse-slow">
              Reset Password
            </h4>
          </div>
        </div>
      </div>

      <div className="w-full md:w-3/5 p-8 bg-white flex items-center justify-center animate-fade-in">
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
              Forgot password?
            </h2>

            <p className="text-gray-600 text-sm font-[400] animate-pulse-slow">
              Enter your registered email address and we'll send you a password reset link.
            </p>
          </div>

          <Form
            form={form}
            name="forgotPassword"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            className="space-y-6 border border-[#E3E3E3] rounded-2xl shadow-sm p-8 hover:shadow-sm"
          >
            <Form.Item
              name="email"
              label={
                <span className="text-gray-700 font-medium transition-colors duration-300">
                  Email Address
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please input your email address!",
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
                placeholder="Enter your email address"
                className="rounded-lg transition-all duration-300 h-[51px] hover:border-[#007AFF] focus:border-[#007AFF] focus:shadow-lg"
                disabled={isSubmitting}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                block
                className="h-12 rounded-lg bg-[#28A745] border-[#28A745] hover:bg-green-600 hover:border-green-600 text-base font-[400] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isSubmitting}
                icon={isSubmitting ? <LoadingOutlined spin /> : null}
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </Form.Item>

            <div className="text-center text-sm space-y-3 animate-fade-in-up">
              <div>
                <span className="text-gray-600 transition-colors duration-300">
                  Back to{" "}
                  <Link
                    to="/login"
                    className="text-[#007AFF] hover:text-blue-700 font-medium transition-colors duration-300 transform hover:scale-105 inline-block"
                  >
                    Sign In
                  </Link>
                </span>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;