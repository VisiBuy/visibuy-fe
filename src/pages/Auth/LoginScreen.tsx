import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Checkbox,
  message,
  Spin
} from 'antd';
import { 
  EyeInvisibleOutlined, 
  EyeTwoTone,
  MailOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../public/images/VisiBuy-White Colored 1.svg';
import lock from '../../public/icons/lock.svg';
import { useLoginMutation } from '@/features/auth/authApi';

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

const LoginScreen = () => {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await login({ 
        email: values.email, 
        password: values.password 
      }).unwrap();
      
      message.success({
        content: 'Login successful! Redirecting...',
        duration: 2,
        className: 'custom-success-message',
        style: {
          marginTop: '20vh',
        }
      });
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (err: any) {
      message.error({
        content: err?.data?.message || 'Login failed. Please try again.',
        duration: 3,
        className: 'custom-error-message',
        style: {
          marginTop: '20vh',
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadingIcon = (
    <LoadingOutlined 
      style={{ 
        fontSize: 24,
        color: '#28A745'
      }} 
      spin 
    />
  );

  return (
    <div className="min-h-screen flex transition-all duration-300 ease-in-out">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center space-y-4 transform scale-105 transition-transform duration-300">
            <Spin indicator={loadingIcon} size="large" />
            <p className="text-gray-700 font-semibold animate-pulse">Signing you in...</p>
          </div>
        </div>
      )}

      <div className="hidden md:flex md:w-2/5 bg-[#007AFF] flex-col p-10 py-20 px-14 transition-all duration-500 ease-out">
        <div className="flex items-center space-x-2 text-white transform hover:scale-105 transition-transform duration-300">
          <img src={Logo} alt="logo" className="transition-all duration-300" />
        </div>

        <div className="flex gap-2 mt-20 items-center animate-fade-in-up">
          <img 
            src={lock} 
            alt="lock" 
            className='w-[51px] h-[51px] transform hover:scale-110 transition-transform duration-300'
          />
          <div className="flex justify-center items-center">
            <h4 className='text-xl text-white font-semibold animate-pulse-slow'>
              Login
            </h4>
          </div>
        </div>
      </div>

      <div className="w-full md:w-3/5 p-8 bg-white flex items-center justify-center animate-fade-in">
        <div className="w-full max-w-md border border-[#E3E3E3] rounded-2xl shadow-xl p-8 transform hover:shadow-2xl transition-all duration-500 ease-in-out bg-white">
          
          <div className="md:hidden flex items-center space-x-2 text-[#007AFF] mb-8 justify-center animate-bounce-in">
            <img src={Logo} alt="logo" className="h-8 transform hover:scale-110 transition-transform duration-300" />
          </div>

          <div className="mb-8 text-center animate-fade-in-up">
           <h2 className="text-4xl font-semibold text-gray-900 mb-2 transform hover:scale-105 transition-transform duration-300 tracking-[1%]">
  Welcome back!
</h2>

            <p className="text-gray-600 text-base font-[400] animate-pulse-slow">
              Enter your details to sign in to your account
            </p>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            className="space-y-6"
          >
            <Form.Item
              name="email"
              label={
                <span className="text-gray-700 font-medium transition-colors duration-300">
                  Email or Phone Number
                </span>
              }
              rules={[
                {
                  required: true,
                  message: 'Please input your email or phone number!',
                },
                {
                  type: 'email',
                  message: 'Please enter a valid email address!',
                },
              ]}
            >
              <Input
                suffix={<MailOutlined className="text-gray-400 transition-colors duration-300 hover:text-[#007AFF]" />}
                placeholder="Enter your email or phone number"
                className="rounded-lg transition-all duration-300 hover:border-[#007AFF] focus:border-[#007AFF] focus:shadow-lg"
                disabled={isLoading}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <span className="text-gray-700 font-medium transition-colors duration-300">
                  Password
                </span>
              }
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
                {
                  min: 6,
                  message: 'Password must be at least 6 characters!',
                },
              ]}
            >
              <Input.Password
                placeholder="Enter your password"
                iconRender={(visible) =>
                  visible ? 
                    <EyeTwoTone className="transition-colors duration-300 hover:text-[#007AFF]" /> : 
                    <EyeInvisibleOutlined className="transition-colors duration-300 hover:text-[#007AFF]" />
                }
                className="rounded-lg transition-all duration-300 hover:border-[#007AFF] focus:border-[#007AFF] focus:shadow-lg"
                disabled={isLoading}
              />
            </Form.Item>

            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox 
                  className="text-gray-600 transition-colors duration-300 hover:text-[#007AFF]"
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
                className="h-12 rounded-lg bg-[#28A745] border-[#28A745] hover:bg-green-600 hover:border-green-600 text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading}
                icon={isLoading ? <LoadingOutlined spin /> : null}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form.Item>

          <div className="text-center space-y-3 animate-fade-in-up">
  <div>
    <span className="text-gray-600 transition-colors duration-300">
      Don't have an account?{' '}
      <Link 
        to="/signup"
        className="text-[#007AFF] hover:text-blue-700 font-medium transition-colors duration-300 transform hover:scale-105 inline-block"
      >
        Sign up
      </Link>
    </span>
  </div>
  <div>
    <Link 
      to="/forgot-password" // You can add this route later if needed
      className="text-[#007AFF] hover:text-blue-700 font-medium transition-colors duration-300 transform hover:scale-105 inline-block"
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