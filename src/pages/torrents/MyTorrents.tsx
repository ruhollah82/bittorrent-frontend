import { useEffect } from 'react';
import { Table, Button, Space, Tag, Popconfirm, Typography, Card } from 'antd';
import {
  UploadOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useTorrentStore } from '../../stores/torrentStore';
import type { Torrent } from '../../types/api';

const { Title } = Typography;

const MyTorrents = () => {
  const navigate = useNavigate();
  const { myTorrents, isLoading, error, fetchMyTorrents, deleteTorrent } = useTorrentStore();

  useEffect(() => {
    fetchMyTorrents();
  }, [fetchMyTorrents]);

  const handleDelete = async (infoHash: string) => {
    try {
      await deleteTorrent(infoHash);
    } catch (error) {
      // Error is handled by the store
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Torrent) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{name}</div>
          <Space size="small">
            {record.category_name && (
              <Tag color="blue">{record.category_name}</Tag>
            )}
            {record.tags && Array.isArray(record.tags) && record.tags.map((tag) => (
              <Tag key={tag} size="small">
                {tag}
              </Tag>
            ))}
          </Space>
        </div>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size: number, record: Torrent) => {
        // Use size_formatted if available, otherwise format size
        const formattedSize = record.size_formatted ?
          `${record.size_formatted.toFixed(2)} GB` :
          `${(size / (1024 * 1024)).toFixed(2)} MB`;
        return formattedSize;
      },
    },
    {
      title: 'Seeders',
      dataIndex: 'seeders',
      key: 'seeders',
      render: (seeders: number) => (
        <span style={{ color: '#52c41a' }}>
          <UploadOutlined style={{ marginRight: 4 }} />
          {seeders || 0}
        </span>
      ),
    },
    {
      title: 'Leechers',
      dataIndex: 'leechers',
      key: 'leechers',
      render: (leechers: number) => (
        <span style={{ color: '#fa8c16' }}>
          <DownloadOutlined style={{ marginRight: 4 }} />
          {leechers || 0}
        </span>
      ),
    },
    {
      title: 'Health',
      dataIndex: 'health',
      key: 'health',
      render: (health: string) => {
        if (!health) return <Tag color="default">Unknown</Tag>;

        const colors = {
          healthy: 'success',
          warning: 'warning',
          critical: 'error',
        };
        return <Tag color={colors[health as keyof typeof colors] || 'default'}>{health}</Tag>;
      },
    },
    {
      title: 'Uploaded',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => {
        try {
          return new Date(date).toLocaleDateString();
        } catch (error) {
          console.error('Invalid date format:', date);
          return 'Invalid Date';
        }
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Torrent) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/torrents/${record.info_hash}`)}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => {
              // Handle download
              console.log('Download torrent:', record.info_hash);
            }}
          >
            Download
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this torrent?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.info_hash)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          My Torrents
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/torrents/upload')}
        >
          Upload New Torrent
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={myTorrents}
          loading={isLoading}
          rowKey="info_hash"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} torrents`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default MyTorrents;
