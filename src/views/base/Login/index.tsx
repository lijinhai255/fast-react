import { InboxOutlined } from '@ant-design/icons';
import { Upload, Image, Typography, Select, Button } from 'antd';
import React, { useEffect, useState } from 'react';
// import CodeEditor from '../../../components/CodeMirror/index';
import {
  TableUploadProps,
  // extractChineseWords,
  extractWordsFromTables,
  generateObjectsFromTemplate,
  generateResultTemplate,
} from '@/utils';
import { getTransLate } from '@/api/Table';
import CodeEdit from '@/components/CodeEdit';

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
  const [world, setWorld] = useState<any>();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translate, setTranslate] = useState<any[]>([
    'Number',
    'Task Name',
    'Product Name',
    'Carbon emission coefficient',
    'Reporting status',
    'Expired or not',
    'Deadline',
    'operation',
    'There is currently no data available',
  ]);
  const [translate_en, setTranslateEn] = useState<any[]>([]);
  const [editorValue, setEditorValue] = useState(`{
    title: '{0}',
    title_${currentLanguage}:'{1}'
    dataIndex: '{2}',
    width: 100,
  },`);
  const [insertTemplate, setInsertTemplate] =
    useState<any>(`export const columns = ({
    refresh,
    navigate,
  }: {
    navigate: NavigateFunction;
    refresh: TableContext<any>['refresh'];
  }): TableRenderProps<Supplier & { supplierStatus_name: string }>['columns'] => [
   [0]
  ];`);
  const [resultData, setResultData] = useState<any>();
  const [resultDataArr, setResultArrData] = useState<any>();
  const [resultTemplate, setResultTemplate] = useState<any>();
  useEffect(() => {
    if (world && translate && editorValue) {
      const resultValue = generateObjectsFromTemplate(
        translate.map((item, index) => {
          return {
            0: resultDataArr?.[index],
            1: translate?.[index],
            2: translate_en[index],
          };
        }),
        editorValue,
      );
      let str = '';
      resultValue.forEach(item => {
        str += item;
      });

      setResultData(str);
      const templateStr = generateResultTemplate(insertTemplate, str, '[0]');
      setResultTemplate(templateStr);
      // setInsertTemplate(templateStr);
    }
  }, [world, translate, editorValue, currentLanguage]);

  // 获取表格中的中文
  const getTransLateFn = async () => {
    const translatePromises = resultDataArr.map((text: string) => {
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
    if (currentLanguage === 'en') {
      setTranslateEn(successfulTranslations);
    }
    setTranslate(successfulTranslations);
  };

  useEffect(() => {
    if (world) {
      getTransLateFn();
    }
  }, [resultDataArr, currentLanguage]);
  useEffect(() => {
    if (world) {
      const worldArr = extractWordsFromTables(world);
      // const worldArr = extractChineseWords(
      //   world,
      //   'tables_result[0].body[0].row.words',
      // );
      setResultArrData(worldArr);
    }
  }, [world]);
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
            setEditorValue(`{
              title: '{0}',
              title_${e}:'{1}'
              dataIndex: '{1}',
              width: 100,
            },`);
          }}
          value={currentLanguage}
        >
          <Select.Option value='en'>英文</Select.Option>
          <Select.Option value='vie'>越文</Select.Option>
        </Select>
      </Title>
      <div style={{ overflow: 'auto', display: 'flex' }}>
        <div>
          {/* <div>
            <Title level={5}>表格内容(中文) </Title>
            <pre>{JSON.stringify(world, null, 2)}</pre>
          </div> */}
          <div>
            <Title level={5}>表格内容(中文) </Title>
            <pre>{JSON.stringify(resultDataArr, null, 2)}</pre>
          </div>

          <div>
            <Title level={5}>
              翻译后表格内容({{ vie: '越文', en: '英文' }[currentLanguage]}){' '}
            </Title>
            <pre>{JSON.stringify(translate, null, 2)}</pre>
          </div>
        </div>

        {/* <div>
          <Title level={5}>翻译后表格数据 </Title>
          <pre>
            {JSON.stringify(
              translate.map((item, index) => {
                return {
                  0: world[index],
                  1: translate[index],
                };
              }),
              null,
              2,
            )}
          </pre>
        </div> */}
        <div style={{ flex: 1 }}>
          <div style={{ flex: 1 }}>
            <Title level={5}>循环模板 </Title>
            <CodeEdit
              editorValue={editorValue}
              setEditorValue={setEditorValue}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Title level={5}>插入模板 </Title>
            <CodeEdit
              editorValue={insertTemplate}
              setEditorValue={setInsertTemplate}
            />
          </div>
        </div>
        <div style={{ flex: 2 }}>
          <Title level={5}>循环代码</Title>
          <CodeEdit editorValue={resultData} height='60%' />
        </div>
        <div style={{ flex: 2 }}>
          <Title level={5}>
            结果代码 <Button>复制代码</Button>
          </Title>
          <CodeEdit editorValue={resultTemplate} height='60%' />
        </div>
      </div>
    </>
  );
};

export default App;
