import { useEffect, useState } from 'react';
import { Card, Typography, Table, Button, Space, Input, Select, Tag, Modal, Form, message, Popconfirm, Avatar } from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useAdminStore } from '../../stores/adminStore';
import { useCreditStore } from '../../stores/creditStore';
import type { User } from '../../types/api';

const { Title, Text } = Typography;
const { Option } = Select;

const UserManagement = () => {
  const {
    users,
    userPagination,
    isLoading,
    fetchUsers,
    updateUser,
    deleteUser,
  } = useAdminStore();

  const { adjustCredits, promoteUser, userClasses } = useCreditStore();

  const [filters, setFilters] = useState({
    search: '',
    is_active: '',
    ordering: '-date_joined',
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [creditModalVisible, setCreditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [creditForm] = Form.useForm();

  useEffect(() => {
    fetchUsers({ ...filters, page: 1 });
  }, [fetchUsers, filters]);

  const handlePageChange = (page: number) => {
    fetchUsers({ ...filters, page });
  };

  const handleEditUser = async (user: User) => {
    setSelectedUser(user);
    editForm.setFieldsValue({
      username: user.username,
      email: user.email,
      is_active: user.is_active,
      is_staff: user.is_staff,
      is_superuser: user.is_superuser,
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async (values: any) => {
    if (!selectedUser) return;

    try {
      await updateUser(selectedUser.id, values);
      message.success('User updated successfully');
      setEditModalVisible(false);
      fetchUsers({ ...filters, page: userPagination?.next ? Math.floor((userPagination.count - 1) / 25) + 1 : 1 });
    } catch (error) {
      message.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      message.success('User deleted successfully');
      fetchUsers({ ...filters, page: userPagination?.next ? Math.floor((userPagination.count - 1) / 25) + 1 : 1 });
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const handleAdjustCredits = async (values: any) => {
    if (!selectedUser) return;

    try {
      await adjustCredits(selectedUser.id, values.amount, values.reason);
      message.success('Credits adjusted successfully');
      setCreditModalVisible(false);
      creditForm.resetFields();
    } catch (error) {
      message.error('Failed to adjust credits');
    }
  };

  const handlePromoteUser = async (userId: number, newClassId: number) => {
    try {
      await promoteUser(userId, newClassId);
      message.success('User promoted successfully');
      fetchUsers({ ...filters, page: userPagination?.next ? Math.floor((userPagination.count - 1) / 25) + 1 : 1 });
    } catch (error) {
      message.error('Failed to promote user');
    }
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'username',
      key: 'username',
      render: (username: string, record: User) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }}>
            {username?.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <Text strong>{username}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean, record: User) => (
        <Space direction="vertical" size="small">
          <Tag color={isActive ? 'success' : 'error'}>
            {isActive ? 'Active' : 'Inactive'}
          </Tag>
          {record.is_staff && <Tag color="blue">Staff</Tag>}
          {record.is_superuser && <Tag color="gold">Superuser</Tag>}
        </Space>
      ),
      filters: [
        { text: 'Active', value: 'true' },
        { text: 'Inactive', value: 'false' },
      ],
    },
    {
      title: 'User Class',
      dataIndex: 'user_class',
      key: 'user_class',
      render: (userClass: string) => <Tag color="blue">{userClass}</Tag>,
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      render: (credits: string) => <Text strong>{credits}</Text>,
      sorter: true,
    },
    {
      title: 'Joined',
      dataIndex: 'date_joined',
      key: 'date_joined',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          >
            Edit
          </Button>

          <Button
            type="link"
            icon={<DollarOutlined />}
            onClick={() => {
              setSelectedUser(record);
              setCreditModalVisible(true);
            }}
          >
            Credits
          </Button>

          <Select
            placeholder="Promote"
            style={{ width: 100 }}
            onChange={(value) => handlePromoteUser(record.id, parseInt(value))}
          >
            {userClasses.map((userClass) => (
              <Option key={userClass.id} value={userClass.id}>
                {userClass.name}
              </Option>
            ))}
          </Select>

          <Popconfirm
            title="Are you sure you want to delete this user?"
            description="This action cannot be undone."
            onConfirm={() => handleDeleteUser(record.id)}
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

  return (
    <div>
      <Title level={2}>User Management</Title>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="Search users..."
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            style={{ width: 200 }}
            allowClear
          />

          <Select
            placeholder="Status"
            value={filters.is_active}
            onChange={(value) => setFilters(prev => ({ ...prev, is_active: value }))}
            style={{ width: 120 }}
            allowClear
          >
            <Option value="true">Active</Option>
            <Option value="false">Inactive</Option>
          </Select>

          <Select
            value={filters.ordering}
            onChange={(value) => setFilters(prev => ({ ...prev, ordering: value }))}
            style={{ width: 150 }}
          >
            <Option value="-date_joined">Newest First</Option>
            <Option value="date_joined">Oldest First</Option>
            <Option value="-credits">Highest Credits</Option>
            <Option value="credits">Lowest Credits</Option>
          </Select>
        </Space>
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={users}
          loading={isLoading}
          rowKey="id"
          pagination={{
            current: userPagination?.next ? Math.floor((userPagination.count - 1) / 25) + 1 : 1,
            total: userPagination?.count || 0,
            pageSize: 25,
            onChange: handlePageChange,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter username' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="is_active" valuePropName="checked">
            <Space>
              <input type="checkbox" />
              <Text>Active</Text>
            </Space>
          </Form.Item>

          <Form.Item name="is_staff" valuePropName="checked">
            <Space>
              <input type="checkbox" />
              <Text>Staff</Text>
            </Space>
          </Form.Item>

          <Form.Item name="is_superuser" valuePropName="checked">
            <Space>
              <input type="checkbox" />
              <Text>Superuser</Text>
            </Space>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update User
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Adjust Credits Modal */}
      <Modal
        title={`Adjust Credits - ${selectedUser?.username}`}
        open={creditModalVisible}
        onCancel={() => setCreditModalVisible(false)}
        footer={null}
      >
        <Form
          form={creditForm}
          layout="vertical"
          onFinish={handleAdjustCredits}
        >
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please enter amount' }]}
          >
            <Input
              type="number"
              step="0.01"
              placeholder="Positive for credit, negative for debit"
            />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true, message: 'Please enter reason' }]}
          >
            <Input.TextArea rows={3} placeholder="Reason for credit adjustment" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Adjust Credits
              </Button>
              <Button onClick={() => setCreditModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
