import { Button, Result, Typography } from 'antd';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';

const { Paragraph, Text } = Typography;

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title={
        <Text style={{ fontSize: '72px', fontWeight: 'bold', color: '#1890ff' }}>
          404
        </Text>
      }
      subTitle={
        <div>
          <Text style={{ fontSize: '20px', display: 'block', marginBottom: '8px' }}>
            Page Not Found
          </Text>
          <Paragraph style={{ fontSize: '16px', color: '#666' }}>
            The page you're looking for doesn't exist or has been moved.
          </Paragraph>
        </div>
      }
      extra={
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Button
            type="primary"
            icon={<HomeOutlined />}
            onClick={() => navigate('/dashboard')}
            size="large"
          >
            Go to Dashboard
          </Button>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            size="large"
          >
            Go Back
          </Button>
        </div>
      }
    />
  );
};

export default NotFound;
