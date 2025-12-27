import { Spin, Typography, Skeleton, Card, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  text?: string;
  fullscreen?: boolean;
  variant?: 'spinner' | 'skeleton' | 'card';
}

const LoadingSpinner = ({
  size = 'default',
  text,
  fullscreen = false,
  variant = 'spinner'
}: LoadingSpinnerProps) => {
  const renderContent = () => {
    switch (variant) {
      case 'skeleton':
        return (
          <div style={{ padding: '20px' }}>
            <Skeleton active paragraph={{ rows: 4 }} />
            {text && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Text type="secondary">{text}</Text>
              </div>
            )}
          </div>
        );

      case 'card':
        return (
          <Card loading style={{ margin: '20px 0' }}>
            {text && (
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Text type="secondary">{text}</Text>
              </div>
            )}
          </Card>
        );

      default: // spinner
        return (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin
              size={size}
              indicator={<LoadingOutlined style={{ fontSize: size === 'large' ? 32 : 24 }} spin />}
            />
            {text && (
              <div style={{ marginTop: 12 }}>
                <Text type="secondary">{text}</Text>
              </div>
            )}
          </div>
        );
    }
  };

  if (fullscreen) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(2px)',
          zIndex: 9999,
        }}
      >
        {renderContent()}
      </div>
    );
  }

  return renderContent();
};

// Table loading skeleton
export const TableSkeleton = ({ columns = 4, rows = 5 }: { columns?: number; rows?: number }) => (
  <div style={{ padding: '20px' }}>
    <Skeleton active paragraph={{ rows: 0 }} />
    <div style={{ marginTop: 16 }}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton.Input
              key={colIndex}
              active
              style={{ width: `${100 / columns}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Form loading skeleton
export const FormSkeleton = ({ fields = 4 }: { fields?: number }) => (
  <div style={{ padding: '20px' }}>
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index} style={{ marginBottom: 24 }}>
        <Skeleton.Input active style={{ width: '30%', marginBottom: 8 }} />
        <Skeleton.Input active style={{ width: '100%' }} />
      </div>
    ))}
    <Space style={{ marginTop: 24 }}>
      <Skeleton.Button active />
      <Skeleton.Button active />
    </Space>
  </div>
);

// Dashboard loading skeleton
export const DashboardSkeleton = () => (
  <div style={{ padding: '24px' }}>
    <Skeleton.Input active style={{ width: '25%', marginBottom: 24 }} />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 24 }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} style={{ height: 120 }}>
          <Skeleton active paragraph={{ rows: 2 }} />
        </Card>
      ))}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
      <Card title={<Skeleton.Input active style={{ width: 150 }} />}>
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
      <Card title={<Skeleton.Input active style={{ width: 150 }} />}>
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    </div>
  </div>
);

export default LoadingSpinner;
