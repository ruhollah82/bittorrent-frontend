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

  const getRatioColor = (ratio: string) => {
    const ratioNum = parseFloat(ratio);
    if (ratioNum >= 2.0) return 'success';
    if (ratioNum >= 1.0) return 'processing';
    if (ratioNum >= 0.5) return 'warning';
    return 'error';
  };

  const getRatioProgress = (ratio: string) => {
    const ratioNum = parseFloat(ratio);
    return Math.min((ratioNum / 2.0) * 100, 100);
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
              title="Credit Balance"
              value={balance.credits}
              prefix={<CreditCardOutlined />}
              valueStyle={{ color: '#722ed1', fontSize: '32px' }}
            />
            <div style={{ marginTop: 16 }}>
              <Text strong>Bonus Points: </Text>
              <Text style={{ color: '#13c2c2' }}>{balance.bonus_points}</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card>
            <Statistic
              title="Current Ratio"
              value={ratioStatus.ratio}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: getRatioColor(ratioStatus.ratio), fontSize: '32px' }}
            />
            <Progress
              percent={getRatioProgress(ratioStatus.ratio)}
              status={getRatioColor(ratioStatus.ratio) as any}
              showInfo={false}
              style={{ marginTop: 8 }}
            />
            <Text type="secondary" style={{ fontSize: '12px', marginTop: 4, display: 'block' }}>
              Target: {ratioStatus.required_ratio}
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Ratio Status Alert */}
      <Alert
        message={`Ratio Status: ${ratioStatus.status.toUpperCase()}`}
        description={ratioStatus.message}
        type={getRatioColor(ratioStatus.ratio) as any}
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
                    <Text strong>{transaction.reason}</Text>
                    <Tag color={transaction.transaction_type === 'credit' ? 'success' : 'error'}>
                      {transaction.transaction_type.toUpperCase()}
                    </Tag>
                  </Space>
                }
                description={
                  <Space>
                    <Text>Amount: {transaction.amount}</Text>
                    <Text type="secondary">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </Text>
                  </Space>
                }
              />
              <div style={{ textAlign: 'right' }}>
                <Text strong style={{ color: transaction.transaction_type === 'credit' ? '#52c41a' : '#ff4d4f' }}>
                  {transaction.transaction_type === 'credit' ? '+' : '-'}{transaction.amount}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Balance: {transaction.balance_after}
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
