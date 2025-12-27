import { useEffect } from 'react';
import { Card, Typography, Row, Col, Statistic, Progress, Space, Divider, Tag, Alert } from 'antd';
import {
  UploadOutlined,
  DownloadOutlined,
  TrophyOutlined,
  CreditCardOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { useUserStore } from '../../stores/userStore';
import { useCreditStore } from '../../stores/creditStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const { Title, Text } = Typography;

const UserStats = () => {
  const { profile, stats, fetchProfile, fetchStats } = useUserStore();
  const { ratioStatus, fetchRatioStatus } = useCreditStore();

  useEffect(() => {
    fetchProfile();
    fetchStats();
    fetchRatioStatus();
  }, [fetchProfile, fetchStats, fetchRatioStatus]);

  const getRatioColor = (ratio: string) => {
    const ratioNum = parseFloat(ratio);
    if (ratioNum >= 2.0) return 'success';
    if (ratioNum >= 1.0) return 'processing';
    if (ratioNum >= 0.5) return 'warning';
    return 'error';
  };

  const getRatioProgress = (ratio: string) => {
    const ratioNum = parseFloat(ratio);
    return Math.min((ratioNum / 2.0) * 100, 100);
  };

  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;
    let value = bytes;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }

    return `${value.toFixed(2)} ${units[unitIndex]}`;
  };

  if (!stats || !profile) {
    return <LoadingSpinner text="Loading statistics..." />;
  }

  const ratioNum = parseFloat(stats.ratio);
  const uploadedNum = stats.lifetime_upload;
  const downloadedNum = stats.lifetime_download;

  const statsData = [
    {
      key: '1',
      metric: 'Total Uploaded',
      value: formatBytes(stats.lifetime_upload),
      icon: <UploadOutlined />,
      color: '#52c41a',
    },
    {
      key: '2',
      metric: 'Total Downloaded',
      value: formatBytes(stats.lifetime_download),
      icon: <DownloadOutlined />,
      color: '#fa8c16',
    },
    {
      key: '3',
      metric: 'Current Ratio',
      value: stats.ratio,
      icon: <TrophyOutlined />,
      color: getRatioColor(stats.ratio),
    },
    {
      key: '4',
      metric: 'Available Credits',
      value: stats.available_credit,
      icon: <CreditCardOutlined />,
      color: '#722ed1',
    },
    {
      key: '5',
      metric: 'Active Torrents',
      value: stats.active_torrents,
      icon: <RiseOutlined />,
      color: '#1890ff',
    },
  ];

  return (
    <div>
      <Title level={2}>User Statistics</Title>

      {/* Main Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statsData.map((stat) => (
          <Col xs={24} sm={12} md={8} lg={6} key={stat.key}>
            <Card>
              <Statistic
                title={stat.metric}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Detailed Stats */}
      <Row gutter={[24, 24]}>
        {/* Ratio Status */}
        <Col xs={24} lg={12}>
          <Card title="Ratio Status">
            <Space orientation="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong>Current Ratio: </Text>
                <Text style={{ fontSize: '24px', fontWeight: 'bold', color: getRatioColor(stats.ratio) }}>
                  {stats.ratio}
                </Text>
              </div>

              <div>
                <Text strong>Progress to 2.0 Ratio:</Text>
                <Progress
                  percent={getRatioProgress(stats.ratio)}
                  status={getRatioColor(stats.ratio) as any}
                  showInfo={false}
                  style={{ marginTop: 8 }}
                />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {ratioNum < 2.0 ? `${(2.0 - ratioNum).toFixed(2)} more needed` : 'Excellent ratio achieved!'}
                </Text>
              </div>

              {ratioStatus && (
                <Alert
                  message={`Status: ${ratioStatus.status.toUpperCase()}`}
                  description={ratioStatus.message}
                  type={getRatioColor(ratioStatus.ratio) as any}
                  showIcon
                />
              )}
            </Space>
          </Card>
        </Col>

        {/* Activity Summary */}
        <Col xs={24} lg={12}>
          <Card title="Activity Summary">
            <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text strong>Active Torrents: </Text>
                <Text>{stats.active_torrents}</Text>
              </div>

              {stats.last_announce && (
                <div>
                  <Text strong>Last Announce: </Text>
                  <Text>{new Date(stats.last_announce).toLocaleString()}</Text>
                </div>
              )}

              <Divider />

              <div>
                <Text strong>Data Transfer:</Text>
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Uploaded:</span>
                    <span style={{ color: '#52c41a' }}>{formatBytes(stats.lifetime_upload)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Downloaded:</span>
                    <span style={{ color: '#fa8c16' }}>{formatBytes(stats.lifetime_download)}</span>
                  </div>
                </div>
              </div>

              <Divider />

              <div>
                <Text strong>Credit Information:</Text>
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Total Credits:</span>
                    <span style={{ color: '#722ed1' }}>{stats.total_credit}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Locked Credits:</span>
                    <span style={{ color: '#fa8c16' }}>{stats.locked_credit}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Available Credits:</span>
                    <span style={{ color: '#52c41a' }}>{stats.available_credit}</span>
                  </div>
                </div>
              </div>

              <Divider />

              <div>
                <Text strong>Account Information:</Text>
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>User Class:</span>
                    <Tag color="blue">{profile.user_class}</Tag>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Member Since:</span>
                    <span>{new Date(profile.date_joined).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Performance Metrics */}
      <Card title="Performance Metrics" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card size="small">
              <Statistic
                title="Upload Efficiency"
                value={uploadedNum > 0 ? ((uploadedNum / (uploadedNum + downloadedNum)) * 100).toFixed(1) : 0}
                suffix="%"
                prefix={<RiseOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card size="small">
              <Statistic
                title="Ratio Health"
                value={ratioNum >= 1.0 ? 'Good' : ratioNum >= 0.5 ? 'Warning' : 'Critical'}
                valueStyle={{
                  color: ratioNum >= 1.0 ? '#52c41a' : ratioNum >= 0.5 ? '#fa8c16' : '#ff4d4f'
                }}
              />
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card size="small">
              <Statistic
                title="Data Ratio"
                value={ratioNum.toFixed(2)}
                suffix=""
                prefix={<TrophyOutlined />}
                valueStyle={{ color: getRatioColor(stats.ratio) }}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default UserStats;
