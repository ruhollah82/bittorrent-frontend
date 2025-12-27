import { Card, Typography, Row, Col, Statistic, List, Avatar, Tag, Space, Button } from 'antd';
import {
  AlertOutlined,
  SafetyOutlined,
  UserOutlined,
  BlockOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const { Title, Text } = Typography;

const SecurityDashboard = () => {
  const navigate = useNavigate();

  // Mock data - in real app this would come from API
  const securityStats = {
    suspiciousActivities: 23,
    activeBlocks: 5,
    bannedUsers: 12,
    securityAlerts: 3,
    recentActivities: [
      {
        id: 1,
        type: 'failed_login',
        user: 'user123',
        description: 'Multiple failed login attempts',
        timestamp: new Date().toISOString(),
        severity: 'medium',
      },
      {
        id: 2,
        type: 'ip_block',
        user: 'user456',
        description: 'IP blocked due to suspicious activity',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        severity: 'high',
      },
      {
        id: 3,
        type: 'rate_limit',
        user: 'user789',
        description: 'Rate limit exceeded',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        severity: 'low',
      },
    ],
    recentBlocks: [
      {
        id: 1,
        ip: '192.168.1.100',
        reason: 'Brute force attack',
        blocked_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 86400000).toISOString(),
      },
      {
        id: 2,
        ip: '10.0.0.50',
        reason: 'Suspicious torrent uploads',
        blocked_at: new Date(Date.now() - 3600000).toISOString(),
        expires_at: new Date(Date.now() + 172800000).toISOString(),
      },
    ],
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'failed_login': return <AlertOutlined />;
      case 'ip_block': return <BlockOutlined />;
      case 'rate_limit': return <ExclamationCircleOutlined />;
      default: return <AlertOutlined />;
    }
  };

  return (
    <div>
      <Title level={2}>Security Dashboard</Title>

      {/* Security Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Suspicious Activities"
              value={securityStats.suspiciousActivities}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active IP Blocks"
              value={securityStats.activeBlocks}
              prefix={<BlockOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Banned Users"
              value={securityStats.bannedUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Security Alerts"
              value={securityStats.securityAlerts}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Security Activities */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            title="Recent Suspicious Activities"
            extra={<Button type="link" onClick={() => navigate('/admin/security/activities')}>View All</Button>}
          >
            <List
              dataSource={securityStats.recentActivities}
              renderItem={(activity) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={getActivityIcon(activity.type)}
                        style={{
                          backgroundColor: activity.severity === 'high' ? '#ff4d4f' :
                                           activity.severity === 'medium' ? '#fa8c16' : '#52c41a'
                        }}
                      />
                    }
                    title={
                      <Space>
                        <Text strong>{activity.type.replace('_', ' ').toUpperCase()}</Text>
                        <Tag color={getSeverityColor(activity.severity)}>
                          {activity.severity.toUpperCase()}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space orientation="vertical" size="small">
                        <Text>{activity.description}</Text>
                        <Space>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            User: {activity.user}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {new Date(activity.timestamp).toLocaleString()}
                          </Text>
                        </Space>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Active IP Blocks */}
        <Col xs={24} lg={12}>
          <Card
            title="Active IP Blocks"
            extra={<Button type="link" onClick={() => navigate('/admin/security/ip-blocks')}>Manage Blocks</Button>}
          >
            <List
              dataSource={securityStats.recentBlocks}
              renderItem={(block) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar icon={<BlockOutlined />} style={{ backgroundColor: '#ff4d4f' }} />
                    }
                    title={
                      <Space>
                        <Text strong>{block.ip}</Text>
                        <Tag color="error">BLOCKED</Tag>
                      </Space>
                    }
                    description={
                      <Space orientation="vertical" size="small">
                        <Text>{block.reason}</Text>
                        <Space>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Blocked: {new Date(block.blocked_at).toLocaleString()}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Expires: {new Date(block.expires_at).toLocaleString()}
                          </Text>
                        </Space>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Security Actions */}
      <Card title="Security Management" style={{ marginTop: 24 }}>
        <Space wrap size="large">
          <Button type="primary" icon={<AlertOutlined />} onClick={() => navigate('/admin/security/activities')}>
            Monitor Activities
          </Button>
          <Button type="primary" icon={<BlockOutlined />} onClick={() => navigate('/admin/security/ip-blocks')}>
            Manage IP Blocks
          </Button>
          <Button type="primary" icon={<SafetyOutlined />} onClick={() => navigate('/admin/security')}>
            Security Settings
          </Button>
          <Button type="primary" icon={<BarChartOutlined />} onClick={() => navigate('/admin/logs')}>
            Security Logs
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
