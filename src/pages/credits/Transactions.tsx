import { useEffect, useState } from 'react';
import { Card, Typography, Table, Tag, Select, DatePicker, Row, Col, Statistic, Input } from 'antd';
import {
  RiseOutlined,
  FallOutlined,
  SearchOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useCreditStore } from '../../stores/creditStore';
import type { CreditTransaction } from '../../types/api';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Transactions = () => {
  const {
    transactions,
    pagination,
    isLoading,
    fetchTransactions,
  } = useCreditStore();

  const [filters, setFilters] = useState({
    transaction_type: '',
    ordering: '-timestamp',
    search: '',
  });

  useEffect(() => {
    fetchTransactions({ ...filters, page: 1 });
  }, [fetchTransactions, filters]);

  const handlePageChange = (page: number) => {
    fetchTransactions({ ...filters, page });
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };


  const columns = [
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
      sorter: true,
    },
    {
      title: 'Type',
      dataIndex: 'transaction_type',
      key: 'transaction_type',
      render: (type: string) => (
        <Tag color={type === 'credit' ? 'success' : 'error'}>
          {type.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Credit', value: 'credit' },
        { text: 'Debit', value: 'debit' },
      ],
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string, record: CreditTransaction) => (
        <Text
          style={{
            color: record.transaction_type === 'credit' ? '#52c41a' : '#ff4d4f',
            fontWeight: 'bold',
          }}
        >
          {record.transaction_type === 'credit' ? '+' : '-'}{amount}
        </Text>
      ),
      sorter: true,
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: string) => <Text>{reason}</Text>,
    },
    {
      title: 'Balance After',
      dataIndex: 'balance_after',
      key: 'balance_after',
      render: (balance: string) => <Text strong>{balance}</Text>,
      sorter: true,
    },
  ];

  // Calculate totals
  const totalCredits = transactions
    .filter(t => t.transaction_type === 'credit')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalDebits = transactions
    .filter(t => t.transaction_type === 'debit')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <div>
      <Title level={2}>Credit Transactions</Title>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Credits"
              value={totalCredits.toFixed(2)}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Debits"
              value={totalDebits.toFixed(2)}
              prefix={<FallOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Net Change"
              value={(totalCredits - totalDebits).toFixed(2)}
              prefix={(totalCredits - totalDebits) >= 0 ? <RiseOutlined /> : <FallOutlined />}
              valueStyle={{
                color: (totalCredits - totalDebits) >= 0 ? '#52c41a' : '#ff4d4f'
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Transactions"
              value={transactions.length}
              prefix={<DownloadOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search transactions..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              allowClear
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Transaction Type"
              value={filters.transaction_type}
              onChange={(value) => handleFilterChange('transaction_type', value)}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="credit">Credits</Option>
              <Option value="debit">Debits</Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <RangePicker
              style={{ width: '100%' }}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Select
              value={filters.ordering}
              onChange={(value) => handleFilterChange('ordering', value)}
              style={{ width: '100%' }}
            >
              <Option value="-timestamp">Newest First</Option>
              <Option value="timestamp">Oldest First</Option>
              <Option value="-amount">Highest Amount</Option>
              <Option value="amount">Lowest Amount</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Transactions Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={transactions}
          loading={isLoading}
          rowKey="id"
          pagination={{
            current: pagination?.next ? Math.floor((pagination.count - 1) / 25) + 1 : 1,
            total: pagination?.count || 0,
            pageSize: 25,
            onChange: handlePageChange,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} transactions`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default Transactions;
