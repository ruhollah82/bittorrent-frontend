import { useEffect } from 'react';
import { useParams } from 'react-router';
import { Card, Typography, Space, Tag, Button, Avatar, Statistic, Row, Col, Divider } from 'antd';
import {
  DownloadOutlined,
  UploadOutlined,
  UserOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useTorrentStore } from '../../stores/torrentStore';

const { Title, Text, Paragraph } = Typography;

const TorrentDetail = () => {
  const { infoHash } = useParams<{ infoHash: string }>();
  const { selectedTorrent, isLoading, fetchTorrent } = useTorrentStore();

  useEffect(() => {
    if (infoHash) {
      fetchTorrent(infoHash);
    }
  }, [infoHash, fetchTorrent]);

  if (isLoading) {
    return <div>Loading torrent details...</div>;
  }

  if (!selectedTorrent) {
    return <div>Torrent not found</div>;
  }

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        {selectedTorrent.name}
      </Title>

      <Row gutter={[24, 24]}>
        {/* Main Info */}
        <Col xs={24} lg={16}>
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong style={{ fontSize: 16 }}>Description</Text>
                <Paragraph style={{ marginTop: 8 }}>
                  {selectedTorrent.description || 'No description available.'}
                </Paragraph>
              </div>

              <div>
                <Text strong>Tags:</Text>
                <div style={{ marginTop: 8 }}>
                  {selectedTorrent.tags.map((tag) => (
                    <Tag key={tag} style={{ marginRight: 8, marginBottom: 4 }}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>

              <Divider />

              <div>
                <Text strong>Files ({selectedTorrent.file_count})</Text>
                <div style={{ marginTop: 8 }}>
                  {selectedTorrent.files?.map((file) => (
                    <div key={file.id} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <Space>
                        <FileTextOutlined />
                        <Text>{file.filename}</Text>
                        <Text type="secondary">
                          ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                        </Text>
                      </Space>
                    </div>
                  )) || <Text type="secondary">No file information available</Text>}
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {/* Download Button */}
            <Card>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                size="large"
                block
                onClick={() => {
                  // Handle download
                  console.log('Download torrent:', selectedTorrent.info_hash);
                }}
              >
                Download Torrent
              </Button>
            </Card>

            {/* Stats */}
            <Card title="Statistics">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Seeders"
                    value={selectedTorrent.seeders}
                    prefix={<UploadOutlined />}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Leechers"
                    value={selectedTorrent.leechers}
                    prefix={<DownloadOutlined />}
                    valueStyle={{ color: '#cf1322' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Completed"
                    value={selectedTorrent.completed}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Size"
                    value={`${(selectedTorrent.size / (1024 * 1024)).toFixed(2)} MB`}
                  />
                </Col>
              </Row>
            </Card>

            {/* Uploader Info */}
            <Card title="Uploader">
              <Space>
                <Avatar
                  icon={<UserOutlined />}
                  src={selectedTorrent.uploader?.avatar}
                >
                  {selectedTorrent.uploader?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <div>
                  <Text strong>{selectedTorrent.uploader?.username}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                    {new Date(selectedTorrent.uploaded_at).toLocaleDateString()}
                  </Text>
                </div>
              </Space>
            </Card>

            {/* Health Status */}
            <Card title="Health Status">
              <Tag
                color={
                  selectedTorrent.health === 'healthy'
                    ? 'success'
                    : selectedTorrent.health === 'warning'
                    ? 'warning'
                    : 'error'
                }
                style={{ fontSize: 14, padding: '4px 12px' }}
              >
                {selectedTorrent.health.toUpperCase()}
              </Tag>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default TorrentDetail;
