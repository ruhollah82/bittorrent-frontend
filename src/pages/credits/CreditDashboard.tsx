import { useEffect } from 'react';
import { Card, Typography, Row, Col, Statistic, Progress, Button, Space, Divider, Alert, Tag, List, Avatar } from 'antd';
import {
  CreditCardOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  TrophyOutlined,
  ShoppingOutlined,
  BankOutlined,
  UploadOutlined,
  DownloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useCreditStore } from '../../stores/creditStore';
import { useUserStore } from '../../stores/userStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const { Title, Text } = Typography;

const CreditDashboard = () => {
  const navigate = useNavigate();
  const { balance, ratioStatus, userClasses, transactions, fetchBalance, fetchRatioStatus, fetchUserClasses, fetchTransactions } = useCreditStore();
  const { profile } = useUserStore();

  useEffect(() => {
    fetchBalance();
    fetchRatioStatus();
    fetchUserClasses();
    fetchTransactions({ page_size: 5 }); // Get recent 5 transactions
  }, [fetchBalance, fetchRatioStatus, fetchUserClasses, fetchTransactions]);


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

  const currentUserClass = Array.isArray(userClasses) 
    ? userClasses.find(uc => uc.name === profile?.user_class)
    : null;

  if (!balance || !ratioStatus) {
    return <LoadingSpinner text="Loading credit information..." />;
  }

  return (
    <div>
      <Title level={2}>Credit Dashboard</Title>

      {/* Main Credit Balance */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card>
            <Statistic
              title="Available Credits"
              value={balance.available_credit}
              prefix={<CreditCardOutlined />}
              valueStyle={{ color: '#722ed1', fontSize: '32px' }}
            />
            <div style={{ marginTop: 16 }}>
              <Text strong>Total Credits: </Text>
              <Text style={{ color: '#52c41a' }}>{balance.total_credit}</Text>
              <br />
              <Text strong>Locked Credits: </Text>
              <Text style={{ color: '#fa8c16' }}>{balance.locked_credit}</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card>
            <Statistic
              title="Current Ratio"
              value={balance.ratio}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: balance.ratio >= 2.0 ? '#52c41a' : balance.ratio >= 1.0 ? '#1890ff' : '#ff4d4f', fontSize: '32px' }}
            />
            <Progress
              percent={Math.min((balance.ratio / 2.0) * 100, 100)}
              status={balance.ratio >= 2.0 ? 'success' : balance.ratio >= 1.0 ? 'normal' : 'exception'}
              showInfo={false}
              style={{ marginTop: 8 }}
            />
            <Text type="secondary" style={{ fontSize: '12px', marginTop: 4, display: 'block' }}>
              User Class: {balance.user_class}
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Upload/Download Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Lifetime Upload"
              value={formatBytes(balance.lifetime_upload)}
              prefix={<UploadOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Lifetime Download"
              value={formatBytes(balance.lifetime_download)}
              prefix={<DownloadOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Download Multiplier"
              value={`${balance.download_multiplier}x`}
              prefix={<SettingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" style={{ fontSize: '12px', marginTop: 4, display: 'block' }}>
              Max Torrents: {balance.max_torrents}
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Ratio Status Alert */}
      <Alert
        message={`Ratio Status: ${balance.ratio >= 2.0 ? 'EXCELLENT' : balance.ratio >= 1.0 ? 'GOOD' : balance.ratio >= 0.5 ? 'WARNING' : 'CRITICAL'}`}
        description={`Current ratio: ${balance.ratio}. ${balance.ratio >= 2.0 ? 'Excellent ratio achieved!' : balance.ratio >= 1.0 ? 'Good ratio maintained.' : 'Consider uploading more content.'}`}
        type={balance.ratio >= 2.0 ? 'success' : balance.ratio >= 1.0 ? 'info' : balance.ratio >= 0.5 ? 'warning' : 'error'}
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* User Class Information */}
      {currentUserClass && (
        <Card title="Current User Class" style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <Tag color="blue" style={{ fontSize: '16px', padding: '4px 12px' }}>
                  {currentUserClass.name}
                </Tag>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <Statistic
                title="Download Cost Multiplier"
                value={`${currentUserClass.download_cost_multiplier}x`}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Col>

            <Col xs={24} md={8}>
              <Statistic
                title="Upload Credit Multiplier"
                value={`${currentUserClass.upload_credit_multiplier}x`}
                prefix={<RiseOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
          </Row>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Statistic
                title="Required Ratio"
                value={currentUserClass.min_ratio}
                prefix={<TrophyOutlined />}
              />
            </Col>

            <Col xs={24} md={8}>
              <Statistic
                title="Max Torrents"
                value={currentUserClass.max_torrents}
                prefix={<ShoppingOutlined />}
              />
            </Col>

            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <Text strong>Class Color</Text>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: currentUserClass.color,
                    borderRadius: '50%',
                    margin: '8px auto',
                    border: '2px solid #d9d9d9',
                  }}
                />
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card
        title="Recent Transactions"
        extra={<Button type="link" onClick={() => navigate('/credits/transactions')}>View All</Button>}
        style={{ marginBottom: 24 }}
      >
        <List
          dataSource={Array.isArray(transactions) ? transactions.slice(0, 5) : []}
          renderItem={(transaction) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={transaction.transaction_type === 'credit' ? <RiseOutlined /> : <FallOutlined />}
                    style={{
                      backgroundColor: transaction.transaction_type === 'credit' ? '#52c41a' : '#ff4d4f',
                    }}
                  />
                }
                title={
                  <Space>
                    <Text strong>{transaction.description}</Text>
                    <Tag color={transaction.transaction_type === 'upload' ? 'success' : 'error'}>
                      {transaction.transaction_type.toUpperCase()}
                    </Tag>
                  </Space>
                }
                description={
                  <Space>
                    <Text>Amount: {transaction.amount}</Text>
                    <Text type="secondary">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </Text>
                  </Space>
                }
              />
              <div style={{ textAlign: 'right' }}>
                <Text strong style={{ color: transaction.transaction_type === 'upload' ? '#52c41a' : '#ff4d4f' }}>
                  {transaction.transaction_type === 'upload' ? '+' : '-'}{transaction.amount}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Status: {transaction.status}
                </Text>
              </div>
            </List.Item>
          )}
        />
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <Space wrap>
          <Button type="primary" icon={<BankOutlined />} onClick={() => navigate('/credits/transactions')}>
            View All Transactions
          </Button>
          <Button icon={<ShoppingOutlined />} onClick={() => navigate('/torrents')}>
            Browse Torrents
          </Button>
          <Button icon={<RiseOutlined />} onClick={() => navigate('/my-torrents')}>
            Upload Torrents
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default CreditDashboard;
