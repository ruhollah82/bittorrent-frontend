import { Card, Typography, Row, Col } from 'antd';
import { FileTextOutlined, ShareAltOutlined, LockOutlined, TeamOutlined, BarChartOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12 2xl:p-16">
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border-none overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl">
        <Row 
          className="min-h-[450px] sm:min-h-[500px] md:min-h-[550px] lg:min-h-[600px] xl:min-h-[650px] 2xl:min-h-[700px]"
          style={{ height: '100%' }}
        >
          {/* Left Side - Branding */}
          <Col
            xs={0}
            sm={0}
            md={14}
            lg={13}
            xl={12}
            xxl={11}
            className="flex flex-col justify-center items-center text-white relative p-6 sm:p-8 lg:p-10 xl:p-12"
            style={{
              background: 'linear-gradient(to bottom right, #3b82f6, #2563eb)',
              minHeight: '100%',
            }}
          >
            {/* Background Pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            {/* Content */}
            <div className="relative z-10 text-center w-full px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
                <FileTextOutlined className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white" />
              </div>

              <Title
                level={1}
                className="ultra-wide-h1 text-white m-0 mb-2 sm:mb-3 lg:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight"
              >
                BitTorrent Tracker
              </Title>

              <Paragraph className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-8 lg:mb-12 leading-relaxed max-w-sm mx-auto">
                Share and discover torrents securely with our advanced platform
              </Paragraph>

              {/* Features */}
              <div className="text-left max-w-xs sm:max-w-sm md:max-w-md mx-auto w-full px-2">
                <div className="flex items-start mb-3 sm:mb-4 md:mb-5">
                  <ShareAltOutlined className="text-base sm:text-lg md:text-xl lg:text-2xl mr-2 sm:mr-3 md:mr-4 text-white flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <Text strong className="text-white block text-xs sm:text-sm md:text-base lg:text-lg leading-tight">
                      Easy Sharing
                    </Text>
                    <Text className="text-white/80 text-xs sm:text-xs md:text-sm lg:text-base leading-snug">
                      Upload and share files with the community
                    </Text>
                  </div>
                </div>

                <div className="flex items-start mb-3 sm:mb-4 md:mb-5">
                  <LockOutlined className="text-base sm:text-lg md:text-xl lg:text-2xl mr-2 sm:mr-3 md:mr-4 text-white flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <Text strong className="text-white block text-xs sm:text-sm md:text-base lg:text-lg leading-tight">
                      Secure Platform
                    </Text>
                    <Text className="text-white/80 text-xs sm:text-xs md:text-sm lg:text-base leading-snug">
                      Advanced security and moderation features
                    </Text>
                  </div>
                </div>

                <div className="flex items-start mb-3 sm:mb-4 md:mb-5">
                  <TeamOutlined className="text-base sm:text-lg md:text-xl lg:text-2xl mr-2 sm:mr-3 md:mr-4 text-white flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <Text strong className="text-white block text-xs sm:text-sm md:text-base lg:text-lg leading-tight">
                      Community Driven
                    </Text>
                    <Text className="text-white/80 text-xs sm:text-xs md:text-sm lg:text-base leading-snug">
                      Join thousands of users worldwide
                    </Text>
                  </div>
                </div>

                <div className="flex items-start">
                  <BarChartOutlined className="text-base sm:text-lg md:text-xl lg:text-2xl mr-2 sm:mr-3 md:mr-4 text-white flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <Text strong className="text-white block text-xs sm:text-sm md:text-base lg:text-lg leading-tight">
                      Analytics
                    </Text>
                    <Text className="text-white/80 text-xs sm:text-xs md:text-sm lg:text-base leading-snug">
                      Track your activity and performance
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Right Side - Form */}
          <Col
            xs={24}
            sm={24}
            md={10}
            lg={11}
            xl={12}
            xxl={13}
            className="flex flex-col justify-center p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 2xl:p-20"
          >
            <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto w-full">
              {children}
            </div>

            {/* Footer */}
            <div className="text-center mt-4 sm:mt-6 md:mt-8 lg:mt-10 xl:mt-12 pt-4 sm:pt-6 border-t border-gray-200">
              <Text type="secondary" className="text-xs sm:text-sm md:text-base">
                © 2025 BitTorrent Tracker. All rights reserved.
              </Text>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AuthLayout;