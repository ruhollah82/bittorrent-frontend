import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Result, Button, Typography, Space } from 'antd';
import { ExclamationCircleOutlined, ReloadOutlined, HomeOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Result
            status="error"
            icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: '64px' }} />}
            title={
              <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>
                Something went wrong
              </Text>
            }
            subTitle={
              <Paragraph style={{ fontSize: '16px', margin: '16px 0' }}>
                We apologize for the inconvenience. An unexpected error occurred.
                Please try refreshing the page or contact support if the problem persists.
              </Paragraph>
            }
            extra={
              <Space size="large">
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={this.handleReload}
                  size="large"
                >
                  Reload Page
                </Button>
                <Button
                  icon={<HomeOutlined />}
                  onClick={this.handleGoHome}
                  size="large"
                >
                  Go Home
                </Button>
              </Space>
            }
          />

          {/* Development error details */}
          {import.meta.env.DEV && (
            <div style={{ marginTop: '24px', textAlign: 'left' }}>
              <details style={{ whiteSpace: 'pre-wrap' }}>
                <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                  <Text strong>Error Details (Development Only)</Text>
                </summary>
                <div style={{
                  background: '#f5f5f5',
                  padding: '12px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  overflow: 'auto',
                  maxHeight: '300px',
                }}>
                  <div>
                    <strong>Error:</strong> {this.state.error?.toString()}
                  </div>
                  {this.state.errorInfo && (
                    <div style={{ marginTop: '8px' }}>
                      <strong>Component Stack:</strong>
                      {this.state.errorInfo.componentStack}
                    </div>
                  )}
                </div>
              </details>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
