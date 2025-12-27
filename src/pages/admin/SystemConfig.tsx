import { useEffect, useState } from 'react';
import { Card, Typography, Table, Button, Space, Input, Select, Tag, Modal, Form, message, Input as AntInput } from 'antd';
import { SearchOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useAdminStore } from '../../stores/adminStore';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = AntInput;

const SystemConfig = () => {
  const {
    systemConfigs,
    systemConfigPagination,
    isLoading,
    fetchSystemConfigs,
    updateSystemConfig,
  } = useAdminStore();

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    ordering: 'category',
  });

  const [selectedConfig, setSelectedConfig] = useState<any>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();

  useEffect(() => {
    fetchSystemConfigs({ ...filters, page: 1 });
  }, [fetchSystemConfigs, filters]);

  const handlePageChange = (page: number) => {
    fetchSystemConfigs({ ...filters, page });
  };

  const handleEditConfig = (config: any) => {
    setSelectedConfig(config);
    editForm.setFieldsValue({
      value: config.value,
      description: config.description,
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async (values: any) => {
    if (!selectedConfig) return;

    try {
      await updateSystemConfig(selectedConfig.id, {
        value: values.value,
        description: values.description,
      });
      message.success('Configuration updated successfully');
      setEditModalVisible(false);
      fetchSystemConfigs({ ...filters, page: systemConfigPagination?.next ? Math.floor((systemConfigPagination.count - 1) / 25) + 1 : 1 });
    } catch (error) {
      message.error('Failed to update configuration');
    }
  };

  const renderConfigValue = (value: any): React.ReactNode => {
    if (typeof value === 'boolean') {
      return <Tag color={value ? 'success' : 'error'}>{value ? 'True' : 'False'}</Tag>;
    }
    if (typeof value === 'number') {
      return <Text strong>{value}</Text>;
    }
    if (typeof value === 'string') {
      return <Text>{value.length > 50 ? `${value.substring(0, 50)}...` : value}</Text>;
    }
    return <Text type="secondary">Complex value</Text>;
  };

  const columns = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      render: (key: string) => <Text code>{key}</Text>,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: renderConfigValue,
      width: 200,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
      filters: [
        { text: 'General', value: 'general' },
        { text: 'Security', value: 'security' },
        { text: 'Credits', value: 'credits' },
        { text: 'Torrents', value: 'torrents' },
        { text: 'UI', value: 'ui' },
      ],
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <Text type="secondary">
          {description.length > 100 ? `${description.substring(0, 100)}...` : description}
        </Text>
      ),
    },
    {
      title: 'Public',
      dataIndex: 'is_public',
      key: 'is_public',
      render: (isPublic: boolean) => (
        <Tag color={isPublic ? 'success' : 'default'}>
          {isPublic ? 'Public' : 'Private'}
        </Tag>
      ),
    },
    {
      title: 'Updated',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (date: string) => new Date(date).toLocaleString(),
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditConfig(record)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  // Group configs by category for summary
  const categoryStats = systemConfigs.reduce((acc: any, config) => {
    acc[config.category] = (acc[config.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <Title level={2}>System Configuration</Title>

      {/* Category Summary */}
      <Card style={{ marginBottom: 16 }}>
        <Title level={4}>Configuration Summary</Title>
        <Space wrap>
          {Object.entries(categoryStats).map(([category, count]) => (
            <Card size="small" key={category}>
              <Text strong style={{ textTransform: 'capitalize' }}>{category}: </Text>
              <Text>{count as number} settings</Text>
            </Card>
          ))}
        </Space>
      </Card>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="Search configurations..."
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            style={{ width: 250 }}
            allowClear
          />

          <Select
            placeholder="Category"
            value={filters.category}
            onChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
            style={{ width: 150 }}
            allowClear
          >
            <Option value="general">General</Option>
            <Option value="security">Security</Option>
            <Option value="credits">Credits</Option>
            <Option value="torrents">Torrents</Option>
            <Option value="ui">UI</Option>
          </Select>

          <Select
            value={filters.ordering}
            onChange={(value) => setFilters(prev => ({ ...prev, ordering: value }))}
            style={{ width: 150 }}
          >
            <Option value="category">By Category</Option>
            <Option value="key">By Key</Option>
            <Option value="-updated_at">Recently Updated</Option>
            <Option value="updated_at">Oldest Updated</Option>
          </Select>
        </Space>
      </Card>

      {/* Configurations Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={systemConfigs}
          loading={isLoading}
          rowKey="id"
          pagination={{
            current: systemConfigPagination?.next ? Math.floor((systemConfigPagination.count - 1) / 25) + 1 : 1,
            total: systemConfigPagination?.count || 0,
            pageSize: 25,
            onChange: handlePageChange,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} configurations`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Edit Configuration Modal */}
      <Modal
        title={`Edit Configuration - ${selectedConfig?.key}`}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <div style={{ marginBottom: 16 }}>
            <Text strong>Key: </Text>
            <Text code>{selectedConfig?.key}</Text>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Text strong>Category: </Text>
            <Tag color="blue">{selectedConfig?.category}</Tag>
          </div>

          <Form.Item
            name="value"
            label="Value"
            rules={[{ required: true, message: 'Please enter a value' }]}
          >
            {typeof selectedConfig?.value === 'boolean' ? (
              <Select>
                <Option value={true}>True</Option>
                <Option value={false}>False</Option>
              </Select>
            ) : typeof selectedConfig?.value === 'number' ? (
              <Input type="number" />
            ) : (
              <TextArea rows={4} />
            )}
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Update Configuration
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SystemConfig;
