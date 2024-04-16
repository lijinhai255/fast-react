import { InboxOutlined } from '@ant-design/icons';
import { Upload, Image, Typography, Select } from 'antd';
import React, { useEffect, useState } from 'react';
// import CodeEditor from '../../../components/CodeMirror/index';
import { TableUploadProps } from '@/utils';
import { getTransLate } from '@/api/Table';

const { Title } = Typography;
const { Dragger } = Upload;
/**
 * Convert a File object to a Base64 string.
 * @param {File} file - The file to be converted.
 * @param {Function} callback - A callback function to be called after conversion.
 */

const App: React.FC = () => {
  const [fileList, setFileList] = useState<{
    filename?: string;
    image?: string;
  }>({});
  const [world, setWorld] = useState<any[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translate, setTranslate] = useState<any[]>([]);
  // 获取表格中的中文
  const getTransLateFn = async () => {
    const translatePromises = world.map((text: string) => {
      return getTransLate({
        text,
        from: 'zh',
        to: currentLanguage,
      });
    });
    const results = await Promise.all(translatePromises);

    const successfulTranslations = results
      .filter(result => result.data && result.data.code === 200)
      .map(result => result.data.data);

    setTranslate(successfulTranslations);
  };

  useEffect(() => {
    if (world) {
      getTransLateFn();
    }
  }, [world, currentLanguage]);
  return (
    <>
      <Dragger {...TableUploadProps(setFileList, setWorld)}>
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>识别表格</p>
      </Dragger>
      <Image width='100%' src={fileList?.image} />
      <Title level={4}>
        识别内容{' '}
        <Select
          onChange={e => {
            setCurrentLanguage(e);
          }}
          value={currentLanguage}
        >
          <Select.Option value='en'>英文</Select.Option>
          <Select.Option value='vie'>越文</Select.Option>
        </Select>
      </Title>
      <div style={{ overflow: 'auto', display: 'flex' }}>
        <div>
          <Title level={5}>表格内容(中文) </Title>
          <pre>{JSON.stringify(world, null, 2)}</pre>
        </div>
        <div>
          <Title level={5}>
            翻译后表格内容({{ vie: '越文', en: '英文' }[currentLanguage]}){' '}
          </Title>
          <pre>{JSON.stringify(translate, null, 2)}</pre>
        </div>
      </div>
    </>
  );
};

export default App;
