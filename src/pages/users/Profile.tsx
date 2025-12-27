import { useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Avatar, Space, Upload, message, Divider, Tag, Alert } from 'antd';
import { UserOutlined, MailOutlined, UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { useUserStore } from '../../stores/userStore';
import { useAuthStore } from '../../stores/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Profile = () => {
  const [form] = Form.useForm();
  const { profile, isLoading, error, fetchProfile, updateProfile, clearError } = useUserStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        username: profile.username,
        email: profile.email,
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
      });
    }
  }, [profile, form]);

  const handleSubmit = async (values: any) => {
    try {
      clearError();
      await updateProfile({
        username: values.username,
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
      });
      message.success('Profile updated successfully');
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  const uploadProps = {
    name: 'avatar',
    listType: 'picture-card',
    className: 'avatar-uploader',
    showUploadList: false,
    action: '/api/user/avatar/', // This would need to be implemented in the backend
    beforeUpload: (file: File) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
    onChange: (info: any) => {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  if (!profile) {
    return (
      <div>
        <Title level={2}>User Profile</Title>
        <Card>
          <Alert message="Failed to load profile" type="error" showIcon />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>User Profile</Title>

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

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Profile Avatar and Info */}
        <Card title="Profile Picture">
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <Avatar
              size={120}
              icon={<UserOutlined />}
              src={profile.avatar}
              style={{ backgroundColor: '#1890ff', marginBottom: 16 }}
            >
              {profile.username?.charAt(0).toUpperCase()}
            </Avatar>

            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>
                Change Avatar
              </Button>
            </Upload>
          </div>

          <Divider />

          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div>
              <Text strong>User Class:</Text>
              <br />
              <Tag color="blue" style={{ marginTop: 4 }}>
                {profile.user_class}
              </Tag>
            </div>

            <div>
              <Text strong>Member Since:</Text>
              <br />
              <Text>{new Date(profile.date_joined).toLocaleDateString()}</Text>
            </div>

            <div>
              <Text strong>Last Login:</Text>
              <br />
              <Text>{profile.last_login ? new Date(profile.last_login).toLocaleDateString() : 'Never'}</Text>
            </div>

            <div>
              <Text strong>Account Status:</Text>
              <br />
              <Tag color={profile.is_active ? 'success' : 'error'}>
                {profile.is_active ? 'Active' : 'Inactive'}
              </Tag>
            </div>
          </Space>
        </Card>

        {/* Profile Form */}
        <Card title="Edit Profile">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              username: profile.username,
              email: profile.email,
              first_name: profile.first_name || '',
              last_name: profile.last_name || '',
            }}
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: 'Please enter a username' },
                { min: 3, message: 'Username must be at least 3 characters' },
                { max: 30, message: 'Username must be less than 30 characters' },
              ]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input prefix={<MailOutlined />} />
            </Form.Item>

            <Form.Item
              name="first_name"
              label="First Name"
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="last_name"
              label="Last Name"
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={isLoading}
                block
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
