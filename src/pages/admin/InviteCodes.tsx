import { useEffect, useState } from 'react';
import { Card, Typography, Table, Button, Space, Tag, Modal, Form, message, Popconfirm, DatePicker } from 'antd';
import { PlusOutlined, DeleteOutlined, CopyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAdminStore } from '../../stores/adminStore';

const { Title, Text } = Typography;

const InviteCodes = () => {
  const {
    inviteCodes,
    inviteCodePagination,
    isLoading,
    fetchInviteCodes,
    createInviteCode,
    deleteInviteCode,
  } = useAdminStore();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();

  useEffect(() => {
    fetchInviteCodes({ page: 1 });
  }, [fetchInviteCodes]);

  const handlePageChange = (page: number) => {
    fetchInviteCodes({ page });
  };

  const handleCreateInvite = async (values: any) => {
    try {
      await createInviteCode({
        expires_at: values.expires_at ? values.expires_at.toISOString() : undefined,
      });
      message.success('Invite code created successfully');
      setCreateModalVisible(false);
      createForm.resetFields();
      fetchInviteCodes({ page: inviteCodePagination?.next ? Math.floor((inviteCodePagination.count - 1) / 25) + 1 : 1 });
    } catch (error) {
      message.error('Failed to create invite code');
    }
  };

  const handleDeleteInvite = async (id: number) => {
    try {
      await deleteInviteCode(id);
      message.success('Invite code deleted successfully');
      fetchInviteCodes({ page: inviteCodePagination?.next ? Math.floor((inviteCodePagination.count - 1) / 25) + 1 : 1 });
    } catch (error) {
      message.error('Failed to delete invite code');
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    message.success('Invite code copied to clipboard');
  };

  const columns = [
    {
      title: 'Invite Code',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => (
        <Space>
          <Text code style={{ fontSize: '14px' }}>{code}</Text>
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={() => copyToClipboard(code)}
            size="small"
          />
        </Space>
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
        const isUsed = record.used_by !== null;

        if (isUsed) {
          return <Tag color="success">Used</Tag>;
        } else if (isExpired) {
          return <Tag color="error">Expired</Tag>;
        } else if (!isActive) {
          return <Tag color="default">Inactive</Tag>;
        } else {
          return <Tag color="processing">Active</Tag>;
        }
      },
    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      key: 'created_by',
      render: (createdBy: any) => createdBy?.username || 'System',
    },
    {
      title: 'Used By',
      dataIndex: 'used_by',
      key: 'used_by',
      render: (usedBy: any) => usedBy?.username || <Text type="secondary">-</Text>,
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: true,
    },
    {
      title: 'Expires',
      dataIndex: 'expires_at',
      key: 'expires_at',
      render: (date: string | null) => (
        date ? new Date(date).toLocaleDateString() : <Text type="secondary">Never</Text>
      ),
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          {!record.used_by && !record.is_active && (
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              onClick={() => {
                // Activate invite code (would need API endpoint)
                message.info('Activate functionality not implemented yet');
              }}
            >
              Activate
            </Button>
          )}

          <Popconfirm
            title="Are you sure you want to delete this invite code?"
            description="This action cannot be undone."
            onConfirm={() => handleDeleteInvite(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Statistics
  const totalCodes = inviteCodes.length;
  const usedCodes = inviteCodes.filter(code => code.used_by).length;
  const activeCodes = inviteCodes.filter(code => code.is_active && !code.used_by).length;
  const expiredCodes = inviteCodes.filter(code => {
    const expiresAt = code.expires_at ? new Date(code.expires_at) : null;
    return expiresAt && expiresAt < new Date();
  }).length;

  return (
    <div>
      <Title level={2}>Invite Code Management</Title>

      {/* Statistics */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap size="large">
          <div>
            <Text strong>Total Codes: </Text>
            <Text>{totalCodes}</Text>
          </div>
          <div>
            <Text strong>Active Codes: </Text>
            <Text style={{ color: '#1890ff' }}>{activeCodes}</Text>
          </div>
          <div>
            <Text strong>Used Codes: </Text>
            <Text style={{ color: '#52c41a' }}>{usedCodes}</Text>
          </div>
          <div>
            <Text strong>Expired Codes: </Text>
            <Text style={{ color: '#ff4d4f' }}>{expiredCodes}</Text>
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
          Create Invite Code
        </Button>
      </Card>

      {/* Invite Codes Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={inviteCodes}
          loading={isLoading}
          rowKey="id"
          pagination={{
            current: inviteCodePagination?.next ? Math.floor((inviteCodePagination.count - 1) / 25) + 1 : 1,
            total: inviteCodePagination?.count || 0,
            pageSize: 25,
            onChange: handlePageChange,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} invite codes`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Create Invite Code Modal */}
      <Modal
        title="Create Invite Code"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateInvite}
        >
          <Form.Item
            name="expires_at"
            label="Expiration Date (Optional)"
          >
            <DatePicker
              showTime
              placeholder="Select expiration date"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Invite Code
              </Button>
              <Button onClick={() => setCreateModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InviteCodes;
