import { useEffect, useState } from 'react';
import { Card, Typography, Table, Button, Space, Input, Tag, Modal, Form, message, Popconfirm, DatePicker } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  BlockOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const { Title, Text } = Typography;

const IPBlocks = () => {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<any>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Mock data - in real app this would come from API
  const mockBlocks = [
    {
      id: 1,
      ip_address: '192.168.1.100',
      reason: 'Brute force login attempts',
      blocked_by: { username: 'admin', id: 1 },
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 86400000).toISOString(),
      is_active: true,
    },
    {
      id: 2,
      ip_address: '10.0.0.50',
      reason: 'Suspicious torrent uploads',
      blocked_by: { username: 'moderator', id: 2 },
      created_at: new Date(Date.now() - 3600000).toISOString(),
      expires_at: new Date(Date.now() + 172800000).toISOString(),
      is_active: true,
    },
    {
      id: 3,
      ip_address: '172.16.0.25',
      reason: 'Rate limiting violations',
      blocked_by: { username: 'admin', id: 1 },
      created_at: new Date(Date.now() - 7200000).toISOString(),
      expires_at: null, // Permanent block
      is_active: false,
    },
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setBlocks(mockBlocks);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateBlock = async (values: any) => {
    try {
      const newBlock = {
        id: Date.now(),
        ip_address: values.ip_address,
        reason: values.reason,
        blocked_by: { username: 'current_user', id: 1 }, // Would be current user
        created_at: new Date().toISOString(),
        expires_at: values.expires_at ? values.expires_at.toISOString() : null,
        is_active: true,
      };

      setBlocks(prev => [...prev, newBlock]);
      message.success('IP block created successfully');
      setCreateModalVisible(false);
      createForm.resetFields();
    } catch (error) {
      message.error('Failed to create IP block');
    }
  };

  const handleEditBlock = async (values: any) => {
    if (!selectedBlock) return;

    try {
      setBlocks(prev =>
        prev.map(block =>
          block.id === selectedBlock.id
            ? {
                ...block,
                reason: values.reason,
                expires_at: values.expires_at ? values.expires_at.toISOString() : null,
                is_active: values.is_active,
              }
            : block
        )
      );
      message.success('IP block updated successfully');
      setEditModalVisible(false);
    } catch (error) {
      message.error('Failed to update IP block');
    }
  };

  const handleDeleteBlock = async (blockId: number) => {
    try {
      setBlocks(prev => prev.filter(block => block.id !== blockId));
      message.success('IP block removed successfully');
    } catch (error) {
      message.error('Failed to remove IP block');
    }
  };

  const columns = [
    {
      title: 'IP Address',
      dataIndex: 'ip_address',
      key: 'ip_address',
      render: (ip: string) => <Text code style={{ fontSize: '14px' }}>{ip}</Text>,
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: string) => (
        <Text style={{ maxWidth: 250 }} ellipsis={{ tooltip: reason }}>
          {reason}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean, record: any) => {
        const now = new Date();
        const expiresAt = record.expires_at ? new Date(record.expires_at) : null;
        const isExpired = expiresAt && expiresAt < now;

        if (!isActive) {
          return <Tag color="default">Inactive</Tag>;
        } else if (isExpired) {
          return <Tag color="error">Expired</Tag>;
        } else {
          return <Tag color="error">Active</Tag>;
        }
      },
    },
    {
      title: 'Blocked By',
      dataIndex: 'blocked_by',
      key: 'blocked_by',
      render: (blockedBy: any) => blockedBy?.username || 'System',
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString(),
      sorter: true,
    },
    {
      title: 'Expires',
      dataIndex: 'expires_at',
      key: 'expires_at',
      render: (date: string | null) => (
        date ? new Date(date).toLocaleString() : <Text type="secondary">Never</Text>
      ),
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
            onClick={() => {
              setSelectedBlock(record);
              editForm.setFieldsValue({
                ip_address: record.ip_address,
                reason: record.reason,
                expires_at: record.expires_at ? record.expires_at : null,
                is_active: record.is_active,
              });
              setEditModalVisible(true);
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Remove this IP block?"
            description="This will unblock the IP address."
            onConfirm={() => handleDeleteBlock(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Remove
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Statistics
  const activeBlocks = blocks.filter(block => block.is_active).length;
  const expiredBlocks = blocks.filter(block => {
    const expiresAt = block.expires_at ? new Date(block.expires_at) : null;
    return expiresAt && expiresAt < new Date();
  }).length;
  const permanentBlocks = blocks.filter(block => !block.expires_at).length;

  return (
    <div>
      <Title level={2}>IP Block Management</Title>

      {/* Statistics */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap size="large">
          <div>
            <Text strong>Total Blocks: </Text>
            <Text>{blocks.length}</Text>
          </div>
          <div>
            <Text strong>Active Blocks: </Text>
            <Text style={{ color: '#ff4d4f' }}>{activeBlocks}</Text>
          </div>
          <div>
            <Text strong>Expired Blocks: </Text>
            <Text style={{ color: '#fa8c16' }}>{expiredBlocks}</Text>
          </div>
          <div>
            <Text strong>Permanent Blocks: </Text>
            <Text style={{ color: '#722ed1' }}>{permanentBlocks}</Text>
          </div>
        </Space>
      </Card>

      {/* Actions */}
      <Card style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
        >
          Add IP Block
        </Button>
      </Card>

      {/* IP Blocks Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={blocks}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} IP blocks`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Create IP Block Modal */}
      <Modal
        title="Create IP Block"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateBlock}
        >
          <Form.Item
            name="ip_address"
            label="IP Address"
            rules={[
              { required: true, message: 'Please enter an IP address' },
              {
                pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                message: 'Please enter a valid IP address',
              },
            ]}
          >
            <Input placeholder="192.168.1.100" />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true, message: 'Please enter a reason' }]}
          >
            <Input.TextArea rows={3} placeholder="Reason for blocking this IP" />
          </Form.Item>

          <Form.Item
            name="expires_at"
            label="Expiration Date (Optional)"
          >
            <DatePicker
              showTime
              placeholder="Leave empty for permanent block"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Block
              </Button>
              <Button onClick={() => setCreateModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit IP Block Modal */}
      <Modal
        title="Edit IP Block"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditBlock}
        >
          <Form.Item
            name="ip_address"
            label="IP Address"
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true, message: 'Please enter a reason' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="expires_at"
            label="Expiration Date"
          >
            <DatePicker
              showTime
              placeholder="Leave empty for permanent block"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item name="is_active" valuePropName="checked">
            <Space>
              <input type="checkbox" />
              <Text>Active</Text>
            </Space>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update Block
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

export default IPBlocks;
