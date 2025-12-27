import { useEffect, useState } from 'react';
import { Table, Input, Button, Space, Tag, Avatar, Typography, Card, Select, Pagination } from 'antd';
import {
  SearchOutlined,
  DownloadOutlined,
  UploadOutlined,
  EyeOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useTorrentStore } from '../../stores/torrentStore';
import type { Torrent } from '../../types/api';

const { Title } = Typography;
const { Option } = Select;

const TorrentList = () => {
  const navigate = useNavigate();
  const {
    torrents,
    categories,
    pagination,
    isLoading,
    error,
    fetchTorrents,
    fetchCategories,
    searchTorrents,
  } = useTorrentStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCategories();
    fetchTorrents();
  }, [fetchCategories, fetchTorrents]);

  const handleSearch = () => {
    searchTorrents(searchQuery);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    fetchTorrents({ category: category || undefined, page: 1 });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchTorrents({
      page,
      search: searchQuery || undefined,
      category: selectedCategory || undefined,
    });
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
            <Tag color="blue">{record.category}</Tag>
            {record.tags.map((tag) => (
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
      render: (size: number) => `${(size / (1024 * 1024)).toFixed(2)} MB`,
      sorter: true,
    },
    {
      title: 'Seeders',
      dataIndex: 'seeders',
      key: 'seeders',
      render: (seeders: number) => (
        <span style={{ color: '#52c41a' }}>
          <UploadOutlined style={{ marginRight: 4 }} />
          {seeders}
        </span>
      ),
      sorter: true,
    },
    {
      title: 'Leechers',
      dataIndex: 'leechers',
      key: 'leechers',
      render: (leechers: number) => (
        <span style={{ color: '#fa8c16' }}>
          <DownloadOutlined style={{ marginRight: 4 }} />
          {leechers}
        </span>
      ),
      sorter: true,
    },
    {
      title: 'Health',
      dataIndex: 'health',
      key: 'health',
      render: (health: string) => {
        const colors = {
          healthy: 'success',
          warning: 'warning',
          critical: 'error',
        };
        return <Tag color={colors[health as keyof typeof colors] || 'default'}>{health}</Tag>;
      },
    },
    {
      title: 'Uploader',
      dataIndex: 'uploader',
      key: 'uploader',
      render: (uploader: any) => (
        <Space>
          <Avatar size="small" icon={<span>U</span>}>
            {uploader?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <span>{uploader?.username}</span>
        </Space>
      ),
    },
    {
      title: 'Uploaded',
      dataIndex: 'uploaded_at',
      key: 'uploaded_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: true,
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
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        Browse Torrents
      </Title>

      {/* Search and Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <Input
            placeholder="Search torrents..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            Search
          </Button>

          <Select
            placeholder="Filter by category"
            value={selectedCategory}
            onChange={handleCategoryFilter}
            style={{ width: 200 }}
            allowClear
          >
            {categories.map((category) => (
              <Option key={category.id} value={category.name}>
                {category.name}
              </Option>
            ))}
          </Select>

          <Button icon={<FilterOutlined />} onClick={() => fetchTorrents()}>
            Reset Filters
          </Button>
        </Space>
      </Card>

      {/* Torrents Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={torrents}
          loading={isLoading}
          rowKey="info_hash"
          pagination={false}
          scroll={{ x: 800 }}
        />

        {/* Pagination */}
        {pagination && pagination.count > 0 && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Pagination
              current={currentPage}
              total={pagination.count}
              pageSize={25}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} torrents`}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default TorrentList;
