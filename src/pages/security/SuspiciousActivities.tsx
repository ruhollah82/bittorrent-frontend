import { useEffect, useState } from 'react';
import { Card, Typography, Table, Button, Space, Input, Select, Tag, Modal, Form, message, Popconfirm } from 'antd';
import {
  SearchOutlined,
  AlertOutlined,
  EyeOutlined,
  StopOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const { Title, Text } = Typography;
const { Option } = Select;

const SuspiciousActivities = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    severity: '',
    activity_type: '',
  });

  // Mock data - in real app this would come from API
  const mockActivities = [
    {
      id: 1,
      user: { username: 'user123', id: 1 },
      activity_type: 'failed_login',
      description: 'Multiple failed login attempts from different IPs',
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: new Date().toISOString(),
      severity: 'high',
      resolved: false,
    },
    {
      id: 2,
      user: { username: 'user456', id: 2 },
      activity_type: 'rate_limit',
      description: 'API rate limit exceeded multiple times',
      ip_address: '10.0.0.50',
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      severity: 'medium',
      resolved: true,
    },
    {
      id: 3,
      user: { username: 'user789', id: 3 },
      activity_type: 'suspicious_upload',
      description: 'Uploaded torrent with suspicious content patterns',
      ip_address: '172.16.0.25',
      user_agent: 'Transmission/3.00',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      severity: 'low',
      resolved: false,
    },
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getActivityTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      failed_login: 'Failed Login',
      rate_limit: 'Rate Limit',
      suspicious_upload: 'Suspicious Upload',
      ip_block: 'IP Block',
      account_lockout: 'Account Lockout',
    };
    return labels[type] || type;
  };

  const handleResolve = (activityId: number) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { ...activity, resolved: true }
          : activity
      )
    );
    message.success('Activity marked as resolved');
  };

  const handleBanUser = (userId: number) => {
    message.success('User banned successfully');
    // In real app, this would call an API
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => (
        <Space>
          <UserOutlined />
          <span>{user.username}</span>
        </Space>
      ),
    },
    {
      title: 'Activity Type',
      dataIndex: 'activity_type',
      key: 'activity_type',
      render: (type: string) => (
        <Tag color="blue">{getActivityTypeLabel(type)}</Tag>
      ),
      filters: [
        { text: 'Failed Login', value: 'failed_login' },
        { text: 'Rate Limit', value: 'rate_limit' },
        { text: 'Suspicious Upload', value: 'suspicious_upload' },
      ],
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <Text style={{ maxWidth: 300 }} ellipsis={{ tooltip: description }}>
          {description}
        </Text>
      ),
    },
    {
      title: 'IP Address',
      dataIndex: 'ip_address',
      key: 'ip_address',
      render: (ip: string) => <Text code>{ip}</Text>,
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => (
        <Tag color={getSeverityColor(severity)}>
          {severity.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'High', value: 'high' },
        { text: 'Medium', value: 'medium' },
        { text: 'Low', value: 'low' },
      ],
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'resolved',
      key: 'resolved',
      render: (resolved: boolean) => (
        <Tag color={resolved ? 'success' : 'warning'}>
          {resolved ? 'Resolved' : 'Pending'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              Modal.info({
                title: 'Activity Details',
                content: (
                  <div>
                    <p><strong>User:</strong> {record.user.username}</p>
                    <p><strong>Type:</strong> {getActivityTypeLabel(record.activity_type)}</p>
                    <p><strong>Description:</strong> {record.description}</p>
                    <p><strong>IP:</strong> {record.ip_address}</p>
                    <p><strong>User Agent:</strong> {record.user_agent}</p>
                    <p><strong>Time:</strong> {new Date(record.timestamp).toLocaleString()}</p>
                  </div>
                ),
                width: 600,
              });
            }}
          >
            Details
          </Button>

          {!record.resolved && (
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              onClick={() => handleResolve(record.id)}
            >
              Resolve
            </Button>
          )}

          <Popconfirm
            title="Ban this user?"
            description="This will ban the user account."
            onConfirm={() => handleBanUser(record.user.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<StopOutlined />}>
              Ban User
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Suspicious Activities</Title>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="Search activities..."
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            style={{ width: 250 }}
            allowClear
          />

          <Select
            placeholder="Severity"
            value={filters.severity}
            onChange={(value) => setFilters(prev => ({ ...prev, severity: value }))}
            style={{ width: 120 }}
            allowClear
          >
            <Option value="high">High</Option>
            <Option value="medium">Medium</Option>
            <Option value="low">Low</Option>
          </Select>

          <Select
            placeholder="Activity Type"
            value={filters.activity_type}
            onChange={(value) => setFilters(prev => ({ ...prev, activity_type: value }))}
            style={{ width: 150 }}
            allowClear
          >
            <Option value="failed_login">Failed Login</Option>
            <Option value="rate_limit">Rate Limit</Option>
            <Option value="suspicious_upload">Suspicious Upload</Option>
          </Select>
        </Space>
      </Card>

      {/* Activities Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={activities}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} activities`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default SuspiciousActivities;
