import { useEffect } from 'react';
import { Row, Col, Card, Statistic, List, Avatar, Typography, Space, Tag, Progress, Alert } from 'antd';
import { getUserAvatar } from '../utils/avatar';
import {
  UploadOutlined,
  DownloadOutlined,
  CreditCardOutlined,
  UserOutlined,
  TrophyOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { useUserStore } from '../stores/userStore';
import { useTorrentStore } from '../stores/torrentStore';
import { useCreditStore } from '../stores/creditStore';

const { Title, Text } = Typography;

const Dashboard = () => {
  const { profile, stats, fetchProfile, fetchStats } = useUserStore();
  const { popularTorrents, fetchPopularTorrents } = useTorrentStore();
  const { ratioStatus, fetchRatioStatus } = useCreditStore();

  useEffect(() => {
    fetchProfile();
    fetchStats();
    fetchRatioStatus();
    fetchPopularTorrents(5);
  }, [fetchProfile, fetchStats, fetchRatioStatus, fetchPopularTorrents]);

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

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        Dashboard
      </Title>

      {/* Stats Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Uploaded"
              value={formatBytes(stats?.lifetime_upload || 0)}
              prefix={<UploadOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Downloaded"
              value={formatBytes(stats?.lifetime_download || 0)}
              prefix={<DownloadOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Ratio"
              value={stats?.ratio || '0.00'}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            {ratioStatus && (
              <Progress
                percent={getRatioProgress(ratioStatus.ratio)}
                size="small"
                status={getRatioColor(ratioStatus.ratio) as any}
                showInfo={false}
                style={{ marginTop: 8 }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Available Credits"
              value={stats?.available_credit || '0'}
              prefix={<CreditCardOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Total: {stats?.total_credit || '0'}
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[24, 24]}>
        {/* User Info */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <UserOutlined />
                Profile Overview
              </Space>
            }
          >
            {profile && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Avatar
                    size={64}
                    src={profile.profile_picture ? getUserAvatar(profile) : undefined}
                    icon={!profile.profile_picture ? <UserOutlined /> : undefined}
                    style={{ backgroundColor: '#1890ff', marginBottom: 8 }}
                  >
                    {profile.username?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Title level={4} style={{ margin: '8px 0' }}>
                    {profile.username}
                  </Title>
                  <Tag color="blue">{profile.user_class}</Tag>
                </div>

                <Space orientation="vertical" size="small" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Email:</Text>
                    <br />
                    <Text>{profile.email}</Text>
                  </div>
                  <div>
                    <Text strong>Member since:</Text>
                    <br />
                    <Text>{new Date(profile.date_joined).toLocaleDateString()}</Text>
                  </div>
                  <div>
                    <Text strong>Active Torrents:</Text>
                    <br />
                    <Text>{stats?.active_torrents || 0}</Text>
                  </div>
                </Space>
              </div>
            )}
          </Card>
        </Col>

        {/* Popular Torrents */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <FireOutlined />
                Popular Torrents
              </Space>
            }
          >
            <List
              dataSource={Array.isArray(popularTorrents) ? popularTorrents : []}
              renderItem={(torrent) => (
                <List.Item
                  actions={[
                    <Space>
                      <Text type="secondary">
                        <UploadOutlined /> {torrent.seeders}
                      </Text>
                      <Text type="secondary">
                        <DownloadOutlined /> {torrent.leechers}
                      </Text>
                    </Space>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={torrent.uploader?.profile_picture ? getUserAvatar(torrent.uploader) : undefined}
                        icon={!torrent.uploader?.profile_picture ? <UserOutlined /> : undefined}
                        style={{ backgroundColor: '#1890ff' }}
                      >
                        {torrent.uploader?.username?.charAt(0).toUpperCase()}
                      </Avatar>
                    }
                    title={<Text strong>{torrent.name}</Text>}
                    description={
                      <Space>
                        <Text type="secondary">{formatBytes(torrent.size)}</Text>
                        {torrent.category_name && <Tag>{torrent.category_name}</Tag>}
                        <Text type="secondary">
                          by {torrent.uploader?.username}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Ratio Status Alert */}
      {ratioStatus && (
        <Card style={{ marginTop: 24 }}>
          <Alert
            message={`Ratio Status: ${ratioStatus.status.toUpperCase()}`}
            description={ratioStatus.message}
            type={getRatioColor(ratioStatus.ratio) as any}
            showIcon
          />
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
