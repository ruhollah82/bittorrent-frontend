import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Badge, Space, Typography, Switch } from 'antd';
import { getUserAvatar } from '../utils/avatar';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  FileTextOutlined,
  UploadOutlined,
  UserOutlined,
  CreditCardOutlined,
  LogoutOutlined,
  BellOutlined,
  CrownOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router';
import { useAuthStore } from '../stores/authStore';
import { useCreditStore } from '../stores/creditStore';
import { useTheme } from '../theme';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { balance } = useCreditStore();
  const { theme, toggleTheme } = useTheme();

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'stats',
      icon: <DashboardOutlined />,
      label: 'My Stats',
      onClick: () => navigate('/stats'),
    },
    {
      key: 'credits',
      icon: <CreditCardOutlined />,
      label: 'Credits',
      onClick: () => navigate('/credits'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/torrents',
      icon: <FileTextOutlined />,
      label: 'Browse Torrents',
    },
    {
      key: '/my-torrents',
      icon: <FileTextOutlined />,
      label: 'My Torrents',
    },
    {
      key: '/torrents/upload',
      icon: <UploadOutlined />,
      label: 'Upload Torrent',
    },
    {
      key: '/credits',
      icon: <CreditCardOutlined />,
      label: 'Credits',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
  ];

  // Add admin menu items if user is staff or superuser
  if (user?.is_staff || user?.is_superuser) {
    menuItems.push({
      key: '/admin',
      icon: <CrownOutlined />,
      label: 'Admin Panel',
    });
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={80}
        style={{
          background: '#001529',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#002140',
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: collapsed ? 16 : 20,
              fontWeight: 'bold',
            }}
          >
            {collapsed ? 'BT' : 'BitTorrent'}
          </Text>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />

          <Space size="large" align="center">
            {/* Theme Toggle */}
            <Space>
              <SunOutlined />
              <Switch
                checked={theme === 'dark'}
                onChange={toggleTheme}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
              />
            </Space>

            {/* Credits Display */}
            {balance && (
              <div style={{ textAlign: 'right' }}>
                <Text strong style={{ display: 'block', fontSize: '14px' }}>
                  Credits: {balance.available_credit}
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Total: {balance.total_credit}
                </Text>
              </div>
            )}

            {/* Notifications */}
            <Badge count={0} showZero={false}>
              <Button type="text" icon={<BellOutlined />} />
            </Badge>

            {/* User Menu */}
            <Dropdown
              menu={{
                items: userMenuItems,
              }}
              placement="bottomRight"
              arrow
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  src={user?.profile_picture ? getUserAvatar(user) : undefined}
                  icon={!user?.profile_picture ? <UserOutlined /> : undefined}
                  style={{ backgroundColor: '#1890ff' }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                {!collapsed && (
                  <div style={{ textAlign: 'right' }}>
                    <Text strong style={{ display: 'block', fontSize: '14px' }}>
                      {user?.username}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {user?.user_class}
                    </Text>
                  </div>
                )}
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content
          id="main-content"
          style={{
            margin: '24px 16px',
            padding: 24,
            background: '#fff',
            borderRadius: 8,
            minHeight: 'calc(100vh - 112px)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
