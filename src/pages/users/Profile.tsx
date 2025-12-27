import { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Typography, Avatar, Space, Upload, message, Divider, Tag, Alert, Popconfirm, Row, Col, Statistic } from 'antd';
import { UserOutlined, MailOutlined, UploadOutlined, SaveOutlined, DeleteOutlined, GiftOutlined, CrownOutlined } from '@ant-design/icons';
import { useUserStore } from '../../stores/userStore';
import { useAuthStore } from '../../stores/authStore';
import { userApi } from '../../services/api/user';
import { authApi } from '../../services/api/auth';
import { getUserAvatar } from '../../utils/avatar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Profile = () => {
  const [form] = Form.useForm();
  const { profile, isLoading, error, fetchProfile, updateProfile, clearError } = useUserStore();
  const { user } = useAuthStore();
  const [generatingInvite, setGeneratingInvite] = useState(false);
  const [generatedInvite, setGeneratedInvite] = useState<{ code: string; expires_at: string; is_active: boolean } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        username: profile.username,
        email: profile.email,
      });
    }
  }, [profile, form]);

  const handleSubmit = async (values: any) => {
    try {
      clearError();
      await updateProfile({
        username: values.username,
        email: values.email,
      });
      message.success('Profile updated successfully');
    } catch (error: any) {
      // Handle validation errors properly
      const errorData = error.response?.data;
      if (errorData) {
        // Display field-specific errors
        const fieldErrors = Object.entries(errorData)
          .filter(([key]) => key !== 'detail' && key !== 'non_field_errors')
          .map(([field, messages]) => {
            const messageArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${messageArray.join(', ')}`;
          });
        
        if (fieldErrors.length > 0) {
          message.error(fieldErrors.join('; '));
        } else if (errorData.detail) {
          message.error(errorData.detail);
        } else if (errorData.non_field_errors) {
          const nonFieldErrors = Array.isArray(errorData.non_field_errors) 
            ? errorData.non_field_errors.join(', ')
            : errorData.non_field_errors;
          message.error(nonFieldErrors);
        } else {
          message.error('Failed to update profile');
        }
      } else {
      message.error('Failed to update profile');
    }
    }
  };

  const handleGenerateInvite = async () => {
    setGeneratingInvite(true);
    try {
      const result = await authApi.generateInvite();
      setGeneratedInvite(result);
      message.success('Invite code generated successfully!');
      // Refresh profile to update credit balance
      fetchProfile();
    } catch (error: any) {
      console.error('Failed to generate invite:', error);
      const errorData = error.response?.data;

      if (error.response?.status === 403) {
        message.error(`Access denied: ${errorData?.message || 'Insufficient user class'}`);
      } else if (error.response?.status === 402) {
        message.error(`Insufficient credits: Need ${errorData?.required_credit}, have ${errorData?.available_credit}`);
      } else if (error.response?.status === 429) {
        message.error(`Daily limit exceeded: ${errorData?.used_today}/${errorData?.limit} invites used today`);
      } else {
        message.error('Failed to generate invite code');
      }
    } finally {
      setGeneratingInvite(false);
    }
  };

  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleAvatarUpload = async (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return false;
    }

    setUploading(true);
    try {
      await userApi.uploadAvatar(file);
      // Update the profile in the store
      await fetchProfile();
      message.success('Avatar uploaded successfully');
      return false; // Prevent default upload behavior
    } catch (error: any) {
      // Handle validation errors
      const errorMessage = error.response?.data?.profile_picture?.[0] || 
                          error.response?.data?.detail || 
                          error.response?.data?.message ||
                          'Avatar upload failed';
      message.error(errorMessage);
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setRemoving(true);
    try {
      await userApi.removeAvatar();
      await fetchProfile();
      message.success('Avatar removed successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.profile_picture?.[0] || 
                          error.response?.data?.detail || 
                          error.response?.data?.message ||
                          'Failed to remove avatar';
      message.error(errorMessage);
    } finally {
      setRemoving(false);
    }
  };


  const uploadProps = {
    name: 'profile_picture',
    listType: 'picture-card',
    className: 'avatar-uploader',
    showUploadList: false,
    beforeUpload: handleAvatarUpload,
    accept: 'image/jpeg,image/png',
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
              src={profile.profile_picture ? getUserAvatar(profile) : undefined}
              icon={!profile.profile_picture ? <UserOutlined /> : undefined}
              style={{ backgroundColor: '#1890ff', marginBottom: 16 }}
            >
              {profile.username?.charAt(0).toUpperCase()}
            </Avatar>

            <Space orientation="vertical" size="small" style={{ width: '100%' }}>
            <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} loading={uploading} disabled={uploading || removing} block>
                  {uploading ? 'Uploading...' : 'Change Avatar'}
              </Button>
            </Upload>
              
              {profile.profile_picture && (
                <Popconfirm
                  title="Remove avatar?"
                  description="Are you sure you want to remove your profile picture?"
                  onConfirm={handleRemoveAvatar}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button 
                    icon={<DeleteOutlined />} 
                    danger 
                    loading={removing} 
                    disabled={uploading || removing}
                    block
                  >
                    {removing ? 'Removing...' : 'Remove Avatar'}
                  </Button>
                </Popconfirm>
              )}
            </Space>
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
              <Tag color={profile.is_banned ? 'error' : 'success'}>
                {profile.is_banned ? 'Banned' : 'Active'}
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

        {/* Invite Code Generation */}
        <Card title="Generate Invite Code" style={{ marginTop: 24 }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* Requirements Info */}
            <Alert
              message="Invite Code Requirements"
              description={
                <div>
                  <Text strong>User Class:</Text> Member, Trusted, or Elite<br />
                  <Text strong>Cost:</Text> 5.00 credits per code<br />
                  <Text strong>Daily Limit:</Text> 2 codes per day<br />
                  <Text strong>Expiration:</Text> 7 days from creation
                </div>
              }
              type="info"
              showIcon
            />

            {/* Current Status */}
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card size="small">
                  <Statistic
                    title="Your Class"
                    value={profile.user_class}
                    prefix={<CrownOutlined />}
                    valueStyle={{
                      color: profile.user_class === 'elite' ? '#722ed1' :
                             profile.user_class === 'trusted' ? '#52c41a' :
                             profile.user_class === 'member' ? '#1890ff' : '#d9d9d9'
                    }}
                  />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small">
                  <Statistic
                    title="Available Credits"
                    value={(() => {
                      // This would need to be fetched from balance API
                      // For now, showing a placeholder
                      return 'Check Dashboard';
                    })()}
                    prefix={<GiftOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small">
                  <Statistic
                    title="Can Generate"
                    value={(() => {
                      const eligibleClasses = ['member', 'trusted', 'elite'];
                      return eligibleClasses.includes(profile.user_class || '') ? 'Yes' : 'No';
                    })()}
                    valueStyle={{
                      color: (() => {
                        const eligibleClasses = ['member', 'trusted', 'elite'];
                        return eligibleClasses.includes(profile.user_class || '') ? '#52c41a' : '#ff4d4f';
                      })()
                    }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Generate Button */}
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Button
                type="primary"
                icon={<GiftOutlined />}
                size="large"
                loading={generatingInvite}
                onClick={handleGenerateInvite}
                disabled={!['member', 'trusted', 'elite'].includes(profile.user_class || '')}
              >
                {generatingInvite ? 'Generating...' : 'Generate Invite Code (5.00 credits)'}
              </Button>
            </div>

            {/* Generated Invite Display */}
            {generatedInvite && (
              <Alert
                message="Invite Code Generated!"
                description={
                  <div>
                    <Text strong>Code:</Text> <Text code copyable>{generatedInvite.code}</Text><br />
                    <Text strong>Expires:</Text> {new Date(generatedInvite.expires_at).toLocaleString()}<br />
                    <Text strong>Status:</Text> <Tag color={generatedInvite.is_active ? 'success' : 'error'}>
                      {generatedInvite.is_active ? 'Active' : 'Inactive'}
                    </Tag>
                  </div>
                }
                type="success"
                showIcon
                closable
                onClose={() => setGeneratedInvite(null)}
              />
            )}
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
