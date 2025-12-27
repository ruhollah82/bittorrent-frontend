import { Form, Input, Button, Alert, Typography, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, UserAddOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '../../stores/authStore';

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (values: {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    invite_code: string;
  }) => {
    try {
      clearError();
      await register(values);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div>
      <Title level={2} style={{
        marginBottom: 'clamp(8px, 2vw, 16px)',
        textAlign: 'center',
        fontSize: 'clamp(1.8rem, 4vw, 2.5rem)'
      }}>
        Join BitTorrent Tracker
      </Title>
      <Text type="secondary" style={{
        display: 'block',
        marginBottom: 'clamp(24px, 4vw, 40px)',
        textAlign: 'center',
        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)'
      }}>
        Create your account to start sharing and discovering torrents
      </Text>

      <Alert
        message="Invite Only"
        description="This tracker requires an invite code to register. Please obtain one from an existing member."
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={clearError}
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: 'Please enter a username' },
            { min: 3, message: 'Username must be at least 3 characters' },
            { max: 30, message: 'Username must be less than 30 characters' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores' },
          ]}
          style={{ marginBottom: 16 }}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Choose a username"
            size="large"
            autoComplete="username"
            style={{
              borderRadius: 'clamp(6px, 1.5vw, 10px)',
              height: 'clamp(40px, 6vw, 56px)',
              fontSize: 'clamp(14px, 2vw, 16px)'
            }}
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
          style={{ marginBottom: 'clamp(12px, 2vw, 20px)' }}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Enter your email address"
            size="large"
            autoComplete="email"
            style={{
              borderRadius: 'clamp(6px, 1.5vw, 10px)',
              height: 'clamp(40px, 6vw, 56px)',
              fontSize: 'clamp(14px, 2vw, 16px)'
            }}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please enter a password' },
            { min: 8, message: 'Password must be at least 8 characters' },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            },
          ]}
          style={{ marginBottom: 'clamp(12px, 2vw, 20px)' }}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Create a strong password"
            size="large"
            autoComplete="new-password"
            style={{
              borderRadius: 'clamp(6px, 1.5vw, 10px)',
              height: 'clamp(40px, 6vw, 56px)',
              fontSize: 'clamp(14px, 2vw, 16px)'
            }}
          />
        </Form.Item>

        <Form.Item
          name="password_confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
          style={{ marginBottom: 'clamp(12px, 2vw, 20px)' }}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm your password"
            size="large"
            autoComplete="new-password"
            style={{
              borderRadius: 'clamp(6px, 1.5vw, 10px)',
              height: 'clamp(40px, 6vw, 56px)',
              fontSize: 'clamp(14px, 2vw, 16px)'
            }}
          />
        </Form.Item>

        <Form.Item
          name="invite_code"
          rules={[
            { required: true, message: 'Please enter an invite code' },
            { len: 12, message: 'Invite code must be exactly 12 characters' },
          ]}
          style={{ marginBottom: 'clamp(20px, 3vw, 32px)' }}
        >
          <Input
            placeholder="Enter your invite code (12 characters)"
            size="large"
            autoComplete="off"
            style={{
              borderRadius: 'clamp(6px, 1.5vw, 10px)',
              height: 'clamp(40px, 6vw, 56px)',
              fontSize: 'clamp(14px, 2vw, 16px)'
            }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isLoading}
            icon={<UserAddOutlined />}
            block
            style={{
              height: 'clamp(40px, 6vw, 56px)',
              borderRadius: 'clamp(6px, 1.5vw, 10px)',
              fontSize: 'clamp(14px, 2vw, 18px)',
              fontWeight: 500
            }}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </Form.Item>
      </Form>

      <Divider style={{ margin: '16px 0' }}>
        <Text type="secondary">Already have an account?</Text>
      </Divider>

      <Space direction="vertical" style={{ width: '100%' }}>
        <Link to="/login">
          <Button type="link" block>
            Sign In Instead
          </Button>
        </Link>
      </Space>
    </div>
  );
};

export default RegisterPage;
