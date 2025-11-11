import React, { useState, useEffect } from "react";
import { Form, Input, Button, Spin, notification } from "antd";
import {
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../../public/images/VisiBuy-White Colored 1.svg";
import lock from "../../public/icons/lock.svg";
import { useResetPasswordMutation, useVerifyResetTokenMutation } from "@/features/auth/authApi";

const ResetPasswordScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  
  const token = searchParams.get('token');
  
  const [verifyResetToken] = useVerifyResetTokenMutation();
  const [resetPassword] = useResetPasswordMutation();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false);
        setIsVerifying(false);
        showErrorNotification("Invalid or missing reset token");
        return;
      }

      try {
        await verifyResetToken({ token }).unwrap();
        setTokenValid(true);
      } catch (err: any) {
        setTokenValid(false);
        showErrorNotification(err?.data?.message || "Invalid or expired reset token");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const showSuccessNotification = () => {
    api.success({
      message: (
        <span className="font-semibold text-green-900">Password Reset Successfully!</span>
      ),
      description: "Your password has been reset successfully. Redirecting to login...",
      placement: "topRight",
      icon: <CheckCircleOutlined className="text-green-500" />,
      className: "custom-success-notification",
      style: {
        background: "#f6ffed",
        border: "1px solid #b7eb8f",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(82, 196, 26, 0.2)",
      },
      duration: 5,
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
      duration: 4,
    });
  };

  const onFinish = async (values: { newPassword: string; confirmPassword: string }) => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      await resetPassword({
        token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      }).unwrap();

      showSuccessNotification();

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      const errorMessage = err?.data?.message || 
                          "Failed to reset password. Please try again.";
      showErrorNotification(errorMessage);
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

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center space-y-4">
          <Spin indicator={loadingIcon} size="large" />
          <p className="text-gray-700 font-semibold animate-pulse">
            Verifying reset token...
          </p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md">
          <CloseCircleOutlined className="text-red-500 text-4xl mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Invalid Token</h2>
          <p className="text-gray-600 mb-6">The reset link is invalid or has expired.</p>
          <Link 
            to="/forgot-password" 
            className="text-[#007AFF] hover:text-blue-700 font-medium text-lg transition-colors duration-300"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex transition-all duration-300 ease-in-out">
      {contextHolder}

      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center space-y-4 transform scale-105 transition-transform duration-300">
            <Spin indicator={loadingIcon} size="large" />
            <p className="text-gray-700 font-semibold animate-pulse">
              Resetting password...
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
              Set New Password
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
              Set New Password
            </h2>

            <p className="text-gray-600 text-sm font-[400] animate-pulse-slow">
              Create a new secure password for your account. Make sure it's strong and unique.
            </p>
          </div>

          <Form
            form={form}
            name="resetPassword"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            className="space-y-6 border border-[#E3E3E3] rounded-2xl shadow-sm p-8 hover:shadow-sm"
          >
            <Form.Item
              name="newPassword"
              label={
                <span className="text-gray-700 font-medium transition-colors duration-300">
                  New Password
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please input your new password!",
                },
                {
                  min: 8,
                  message: "Password must be at least 8 characters!",
                },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                  message: "Password must include uppercase, lowercase, number, and special character!",
                },
              ]}
            >
              <Input.Password
                prefix={
                  <LockOutlined className="text-gray-400 transition-colors duration-300 hover:text-[#007AFF]" />
                }
                placeholder="Enter your new password"
                className="rounded-lg transition-all duration-300 h-[51px] hover:border-[#007AFF] focus:border-[#007AFF] focus:shadow-lg"
                disabled={isSubmitting}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={
                <span className="text-gray-700 font-medium transition-colors duration-300">
                  Confirm New Password
                </span>
              }
              dependencies={['newPassword']}
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={
                  <LockOutlined className="text-gray-400 transition-colors duration-300 hover:text-[#007AFF]" />
                }
                placeholder="Confirm your new password"
                className="rounded-lg transition-all duration-300 h-[51px] hover:border-[#007AFF] focus:border-[#007AFF] focus:shadow-lg"
                disabled={isSubmitting}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
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
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </Button>
            </Form.Item>

            <div className="text-center text-sm space-y-3 animate-fade-in-up">
              <div>
                <span className="text-gray-600 transition-colors duration-300">
                  Remember your password?{" "}
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

          <div className="mt-6 text-center">
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <LockOutlined className="mr-1" />
              Password must be at least 8 characters with uppercase, lowercase, number, and special character
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;