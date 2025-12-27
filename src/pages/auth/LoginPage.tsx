import { Form, Input, Button, Alert, Typography, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '../../stores/authStore';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      clearError();
      await login(values);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="w-full animate-fade-in">
      {/* Header Section */}
      <div className="text-center mb-6 sm:mb-8 md:mb-10">
        <Title 
          level={2} 
          className="!mb-2 sm:!mb-3 md:!mb-4 !text-2xl sm:!text-3xl md:!text-4xl lg:!text-5xl !font-bold !text-gray-900 dark:!text-white transition-all duration-300"
        >
        Welcome Back
      </Title>
        <Text 
          className="block text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 transition-colors duration-300"
        >
        Sign in to your account to continue
      </Text>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 sm:mb-6 animate-fade-in">
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={clearError}
            className="rounded-lg sm:rounded-xl shadow-sm"
        />
        </div>
      )}

      {/* Form Section */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        className="w-full"
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: 'Please enter your username' },
            { min: 3, message: 'Username must be at least 3 characters' },
          ]}
          className="!mb-4 sm:!mb-5 md:!mb-6"
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Enter your username"
            size="large"
            autoComplete="username"
            className="!h-11 sm:!h-12 md:!h-14 !rounded-lg sm:!rounded-xl !text-sm sm:!text-base !transition-all duration-200 hover:!border-blue-400 focus:!border-blue-500 focus:!shadow-lg focus:!shadow-blue-500/20"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
          className="!mb-5 sm:!mb-6 md:!mb-8"
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Enter your password"
            size="large"
            autoComplete="current-password"
            className="!h-11 sm:!h-12 md:!h-14 !rounded-lg sm:!rounded-xl !text-sm sm:!text-base !transition-all duration-200 hover:!border-blue-400 focus:!border-blue-500 focus:!shadow-lg focus:!shadow-blue-500/20"
          />
        </Form.Item>

        <Form.Item className="!mb-4 sm:!mb-6">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isLoading}
            icon={<LoginOutlined />}
            block
            className="!h-11 sm:!h-12 md:!h-14 !rounded-lg sm:!rounded-xl !text-sm sm:!text-base md:!text-lg !font-semibold !bg-gradient-to-r !from-blue-500 !to-blue-600 hover:!from-blue-600 hover:!to-blue-700 !border-none !shadow-lg hover:!shadow-xl !transition-all duration-300 hover:!scale-[1.02] active:!scale-[0.98]"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form.Item>
      </Form>

      {/* Divider Section */}
      <Divider className="!my-4 sm:!my-6 md:!my-8 !border-gray-200 dark:!border-gray-700">
        <Text className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?
        </Text>
      </Divider>

      {/* Register Link */}
      <Space orientation="vertical" className="w-full">
        <Link to="/register" className="block w-full">
          <Button 
            type="link" 
            block
            className="!h-auto !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !text-blue-600 dark:!text-blue-400 hover:!text-blue-700 dark:hover:!text-blue-300 !transition-colors duration-200"
          >
            Create Account
          </Button>
        </Link>
      </Space>
    </div>
  );
};

export default LoginPage;
