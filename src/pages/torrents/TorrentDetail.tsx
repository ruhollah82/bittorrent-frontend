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
import { torrentApi } from '../../services/api/torrent';
import { message } from 'antd';

const { Title, Text, Paragraph } = Typography;

const TorrentDetail = () => {
  const { infoHash } = useParams<{ infoHash: string }>();
  const { selectedTorrent, isLoading, fetchTorrent } = useTorrentStore();


  const handleDownload = async () => {
    if (!selectedTorrent) {
      console.error('No torrent selected');
      message.error('No torrent selected');
      return;
    }

    try {
      const blob = await torrentApi.downloadTorrent(selectedTorrent.info_hash);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${selectedTorrent.name}.torrent`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      console.log('Download completed successfully');
    } catch (error) {
      console.error('Failed to download torrent:', error);
      message.error('Failed to download torrent');
    }
  };

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
            <Space orientation="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong style={{ fontSize: 16 }}>Description</Text>
                <Paragraph style={{ marginTop: 8 }}>
                  {selectedTorrent.description || 'No description available.'}
                </Paragraph>
              </div>

              <div>
                <Text strong>Tags:</Text>
                <div style={{ marginTop: 8 }}>
                  {selectedTorrent.tags && Array.isArray(selectedTorrent.tags) ? (
                    selectedTorrent.tags.map((tag) => (
                    <Tag key={tag} style={{ marginRight: 8, marginBottom: 4 }}>
                      {tag}
                    </Tag>
                    ))
                  ) : (
                    <Text type="secondary">No tags available</Text>
                  )}
                </div>
              </div>

              <Divider />

              <div>
                <Text strong>Files ({selectedTorrent.files_count})</Text>
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
          <Space orientation="vertical" size="small" style={{ width: '100%' }}>
            {/* Download Button */}
            <Card>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                size="large"
                block
                onClick={handleDownload}
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
                    value={selectedTorrent.seeders || 0}
                    prefix={<UploadOutlined />}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Leechers"
                    value={selectedTorrent.leechers || 0}
                    prefix={<DownloadOutlined />}
                    valueStyle={{ color: '#cf1322' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Completed"
                    value={selectedTorrent.completed || 0}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Size"
                    value={selectedTorrent.size_formatted || `${(selectedTorrent.size / (1024 * 1024)).toFixed(2)} MB`}
                  />
                </Col>
              </Row>
            </Card>

            {/* Uploader Info */}
            <Card title="Uploader">
              <Space>
                <Avatar
                  icon={<UserOutlined />}
                >
                  {selectedTorrent.created_by_username?.charAt(0).toUpperCase()}
                </Avatar>
                <div>
                  <Text strong>{selectedTorrent.created_by_username}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                    {(() => {
                      try {
                        return new Date(selectedTorrent.created_at).toLocaleDateString();
                      } catch (error) {
                        console.error('Invalid date format:', selectedTorrent.created_at);
                        return 'Invalid Date';
                      }
                    })()}
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
                {selectedTorrent.health && typeof selectedTorrent.health === 'string'
                  ? selectedTorrent.health.toUpperCase()
                  : 'UNKNOWN'}
              </Tag>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default TorrentDetail;
