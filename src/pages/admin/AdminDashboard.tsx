import { useEffect } from 'react';
import { Card, Typography, Row, Col, Statistic, List, Avatar, Tag, Space, Button } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  AlertOutlined,
  SafetyOutlined,
  RiseOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useAdminStore } from '../../stores/adminStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { dashboard, isLoading, fetchDashboard } = useAdminStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (isLoading || !dashboard) {
    return <LoadingSpinner text="Loading admin dashboard..." />;
  }

  return (
    <div>
      <Title level={2}>Admin Dashboard</Title>

      {/* Main Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={dashboard.total_users}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Torrents"
              value={dashboard.total_torrents}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Credit Transacted"
              value={parseFloat(dashboard.total_credit_transacted).toFixed(2)}
              prefix={<CreditCardOutlined />}
              suffix="credits"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Peers"
              value={dashboard.active_peers}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Security Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Suspicious Activities"
              value={dashboard.suspicious_activities_today}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active IP Blocks"
              value={dashboard.active_ip_blocks}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#ff7a45' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Banned Users"
              value={dashboard.banned_users}
              prefix={<CrownOutlined />}
              valueStyle={{ color: '#d4380d' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="System Alerts"
              value={dashboard.system_alerts}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row gutter={[24, 24]}>
        {/* Recent Users */}
        <Col xs={24} lg={12}>
          <Card
            title="Recent Users"
            extra={<Button type="link" onClick={() => navigate('/admin/users')}>View All</Button>}
          >
            <List
              dataSource={dashboard.recent_users}
              renderItem={(user: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }}>
                        {user.username?.charAt(0).toUpperCase()}
                      </Avatar>
                    }
                    title={user.username}
                    description={
                      <Space>
                        <Text type="secondary">
                          Joined: {new Date(user.date_joined).toLocaleDateString()}
                        </Text>
                        <Tag color={user.is_active ? 'success' : 'error'}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Recent Suspicious Activities */}
        <Col xs={24} lg={12}>
          <Card
            title="Recent Suspicious Activities"
            extra={<Button type="link" onClick={() => navigate('/admin/security')}>View All</Button>}
          >
            <List
              dataSource={dashboard.recent_suspicious}
              renderItem={(activity: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar icon={<AlertOutlined />} style={{ backgroundColor: '#ff4d4f' }} />
                    }
                    title={activity.activity_type}
                    description={
                      <Space direction="vertical" size="small">
                        <Text type="secondary">{activity.description}</Text>
                        <Space>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            User: {activity.user?.username}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {new Date(activity.timestamp).toLocaleString()}
                          </Text>
                        </Space>
                      </Space>
                    }
                  />
                  <Tag color="error">{activity.severity}</Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Alerts */}
      <Card
        title="Recent System Alerts"
        extra={<Button type="link" onClick={() => navigate('/admin/logs')}>View All</Button>}
        style={{ marginTop: 24 }}
      >
        <List
          dataSource={dashboard.recent_alerts}
          renderItem={(alert: any) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={<AlertOutlined />}
                    style={{
                      backgroundColor:
                        alert.priority === 'urgent' ? '#ff4d4f' :
                        alert.priority === 'high' ? '#ff7a45' :
                        alert.priority === 'medium' ? '#faad14' : '#52c41a'
                    }}
                  />
                }
                title={
                  <Space>
                    <Text strong>{alert.title}</Text>
                    <Tag color={
                      alert.priority === 'urgent' ? 'error' :
                      alert.priority === 'high' ? 'warning' :
                      alert.priority === 'medium' ? 'processing' : 'success'
                    }>
                      {alert.priority.toUpperCase()}
                    </Tag>
                  </Space>
                }
                description={
                  <Space direction="vertical" size="small">
                    <Text>{alert.message}</Text>
                    <Space>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {new Date(alert.created_at).toLocaleString()}
                      </Text>
                      {alert.user && (
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          User: {alert.user.username}
                        </Text>
                      )}
                    </Space>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions" style={{ marginTop: 24 }}>
        <Space wrap size="large">
          <Button type="primary" icon={<UserOutlined />} onClick={() => navigate('/admin/users')}>
            Manage Users
          </Button>
          <Button type="primary" icon={<SettingOutlined />} onClick={() => navigate('/admin/config')}>
            System Config
          </Button>
          <Button type="primary" icon={<SafetyOutlined />} onClick={() => navigate('/admin/security')}>
            Security
          </Button>
          <Button type="primary" icon={<BarChartOutlined />} onClick={() => navigate('/admin/analytics')}>
            Analytics
          </Button>
          <Button type="primary" icon={<CrownOutlined />} onClick={() => navigate('/admin/invites')}>
            Invite Codes
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default AdminDashboard;
