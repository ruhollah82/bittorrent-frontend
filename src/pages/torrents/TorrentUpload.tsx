import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Upload, Select, Space, Typography, Alert, Tag } from 'antd';
import { UploadOutlined, FileTextOutlined, TagOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useTorrentStore } from '../../stores/torrentStore';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const TorrentUpload = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { categories, uploadTorrent, fetchCategories, isLoading, error } = useTorrentStore();
  const [fileList, setFileList] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
    console.log('TorrentUpload: fetchCategories called');
  }, [fetchCategories]);

  console.log('TorrentUpload: categories:', categories);
  console.log('TorrentUpload: isLoading:', isLoading);
  console.log('TorrentUpload: error:', error);

  const handleUpload = async (values: any) => {
    if (fileList.length === 0) {
      console.error('No file selected');
      return;
    }

    console.log('Uploading with fileList:', fileList);
    console.log('File object:', fileList[0]);

    const selectedFile = fileList[0];
    if (!selectedFile) {
      console.error('File object is invalid');
      return;
    }

    const formData = {
      torrent_file: selectedFile, // Use the file object directly
      name: values.name,
      description: values.description,
      category: values.category,
      tags,
    };

    console.log('Form data prepared:', {
      torrent_file: formData.torrent_file?.name,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      tags: formData.tags,
    });

    try {
      const result = await uploadTorrent(formData);
      console.log('Upload successful:', result);
      navigate('/my-torrents');
    } catch (error) {
      console.error('Upload failed:', error);
      // Error is handled by the store
    }
  };

  const uploadProps = {
    onRemove: (file: any) => {
      setFileList([]);
    },
    beforeUpload: (file: any) => {
      console.log('File selected:', file);
      setFileList([file]);
      return false;
    },
    fileList,
    accept: '.torrent',
    maxCount: 1,
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        Upload Torrent
      </Title>

      <Card>
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpload}
        >
          <Form.Item
            label="Torrent File"
            rules={[
              {
                required: true,
                validator: (_, value) => {
                  if (fileList.length === 0) {
                    return Promise.reject(new Error('Please select a torrent file'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>
                Select Torrent File
              </Button>
            </Upload>
            <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              Only .torrent files are allowed
            </Text>
          </Form.Item>

          <Form.Item
            name="name"
            label="Torrent Name"
            rules={[
              { required: true, message: 'Please enter a torrent name' },
              { min: 3, message: 'Name must be at least 3 characters' },
            ]}
          >
            <Input placeholder="Enter torrent name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea
              rows={4}
              placeholder="Enter torrent description (optional)"
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select
              placeholder={categories && categories.length > 0 ? "Select category" : "Loading categories..."}
              loading={!categories || categories.length === 0}
              disabled={!categories || categories.length === 0}
            >
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <Option key={category.id} value={category.name}>
                    {category.name}
                  </Option>
                ))
              ) : (
                <Option disabled>Loading categories...</Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item label="Tags">
            <Space orientation="vertical" style={{ width: '100%' }}>
              <Select
                mode="tags"
                placeholder="Add tags"
                onSelect={addTag}
                style={{ width: '100%' }}
                tokenSeparators={[',']}
                open={false}
              />
              <div>
                {tags.map((tag) => (
                  <Tag
                    key={tag}
                    closable
                    onClose={() => removeTag(tag)}
                    style={{ marginBottom: 4 }}
                  >
                    <TagOutlined style={{ marginRight: 4 }} />
                    {tag}
                  </Tag>
                ))}
              </div>
            </Space>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                icon={<UploadOutlined />}
              >
                {isLoading ? 'Uploading...' : 'Upload Torrent'}
              </Button>
              <Button onClick={() => navigate('/torrents')}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TorrentUpload;
