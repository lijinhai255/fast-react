/*
 * @@description: 文件导入历史
 */

import { Button, Col, Row, Upload, UploadProps } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { useEffect, useRef, useState } from 'react';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { baseUrl } from '@/api/request';
import { FormActions } from '@/components/FormActions';
import { IconFont } from '@/components/IconFont';
import { TableRender } from '@/components/x-render/TableRender';
import { FileUpload, postFootprintFileUpload } from '@/sdks/footprintV2ApiDocs';
import {
  getFootprintFileUpload,
  getFootprintFileUploadProps,
  postFootprintFileUploadUploadFile,
} from '@/sdks_v2/new/footprintV2ApiDocs';
import {
  Toast,
  changeTableColumsNoText,
  getSearchParams,
  updateUrl,
} from '@/utils';
import { useIndexColumn } from '@/utils/columns';
import { UPLOAD_FILES_RANDOMNAME_URL } from '@/utils/const';
import { getToken } from '@/utils/cookie';
import {
  FileListType,
  SearchParamses,
} from '@/views/carbonFootPrint/utils/types';

import style from './index.module.less';
import { downloadFile } from './utils';
import { columns } from './utils/columns';

function ImportFile({
  modelFileType,
  modelType,
  productionBusinessId,
}: {
  modelFileType: string;
  modelType: string;
  productionBusinessId: string;
}) {
  const { form, refresh, setTable } = useTable();
  /** 分页 */
  const [searchParams, setSearchParams] = useState<SearchParamses>({
    current: 1,
  });

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.current) - 1) * Number(searchParams?.pageSize),
  );

  const [fileName, setFileName] = useState('');
  /** 用于修正第一次页码无法正常设置问题 */
  const isFirstLoad = useRef(true);

  /** 模版文件 */
  const MasterplateFile =
    Number(modelType) === 1
      ? {
          url: 'https://carbonstop-saas.oss-cn-beijing.aliyuncs.com/dct/%E4%BA%A7%E5%93%81%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx',
          name: '产品信息导入模板.xlsx',
        }
      : {
          url: 'https://carbonstop-saas.oss-cn-beijing.aliyuncs.com/dct/%E6%8E%92%E6%94%BE%E6%BA%90%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx',
          name: '排放源导入模板.xlsx',
        };

  /** 上传的文件列表 */
  const [fileListParams, setFileListParams] = useState<FileListType>();

  /** 上传文件的loading */
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  /** 导入文件的loading */
  const [importBtnLoading, setImportBtnLoading] = useState(false);

  /** 文件上传 */
  const changeFileFn = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'done') {
      setFileName(info.file.name);
      const { url } = info.file.response.data;
      const suffixArr = info.file.name.split('.');
      const nameArr = url.split('dct/');
      const data = {
        suffix: suffixArr[suffixArr.length - 1],
        name: nameArr[1],
        url,
        fileName: info.file.name,
      };
      setFileListParams(data as FileListType);
      setBtnLoading(false);
    }
  };

  /** 上传文件的参数 */
  const fileProps: UploadProps = {
    showUploadList: false,
    accept: '.xls, .xlsx, .XLS, .XLSX',
    name: 'file',
    onChange: changeFileFn,
    action: `${baseUrl}${UPLOAD_FILES_RANDOMNAME_URL}`,
    headers: {
      Authorization: getToken(),
    },
    beforeUpload: file => {
      const { name } = file;
      const typeFile = name.split('.');
      const fileType = ['xls', 'xlsx', 'XLS', 'XLSX'];
      if (!fileType.includes(typeFile[typeFile.length - 1])) {
        Toast('error', `只支持${fileType.join(',')}格式文件上传`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        Toast('error', `文件太大`);
        return Upload.LIST_IGNORE;
      }
      setBtnLoading(true);
      return true;
    },
  };

  /** 想列表增加模块类型的参数 1: 产品 2: 排放源 */
  useEffect(() => {
    if (modelType) {
      refresh?.(
        { stay: false, tab: 0 },
        {
          type: modelType,
          productionBusinessId,
        },
      );
    }
  }, [modelType, productionBusinessId]);

  /** 导入历史列表 */
  const searchApi: SearchProps<FileUpload>['api'] = ({
    current,
    pageSize,
    type,
    productionBusinessId,
    ...args
  }) => {
    const pageNum =
      (isFirstLoad.current ? searchParams.current : current) || current;
    const search = {
      ...getSearchParams()[0],
    } as Partial<SearchParamses> & Partial<getFootprintFileUploadProps>;
    let newSearch = { ...args, ...search, pageSize };
    if (!isFirstLoad.current) {
      newSearch = {
        current: pageNum,
        pageSize,
        type,
        productionBusinessId,
      };
      updateUrl(newSearch);
    } else {
      form.setValues({ ...getSearchParams()[0] });
    }
    setSearchParams({ ...newSearch, current: newSearch.current || 1 });
    isFirstLoad.current = false;
    const searchVals = {
      ...newSearch,
      page: current,
      size: pageSize,
    } as unknown as getFootprintFileUploadProps;
    setTable?.({ loading: true });
    if (!type) {
      return {
        rows: [],
        total: 0,
      } as unknown as Promise<{
        rows: FileUpload[];
        total: number;
        pageSize?: number | undefined;
      }>;
    }
    return getFootprintFileUpload(searchVals).then(({ data }) => {
      const result = data?.data || {};
      setTable?.({ loading: false, dataSource: result?.records || [] });
      return {
        ...result,
        rows: result?.records || [],
        total: result.total || 0,
      };
    });
  };

  /** 新增导入 */
  const onUploadFileApiFn = async (fileId: number | undefined) => {
    if (!fileListParams || !fileId) return;
    const result = {
      file: fileListParams.url,
      fileType: modelFileType,
      fileId,
      productionBusinessId,
      fileName,
    };
    await postFootprintFileUploadUploadFile(result);
    setImportBtnLoading(false);
    refresh?.(
      { stay: false, tab: 0 },
      {
        type: modelType,
        productionBusinessId,
      },
    );
    setFileListParams(undefined);
  };

  return (
    <div className={style.importFilewrapper}>
      <div>
        <h4>导入产品</h4>
        <div className={style.header}>
          <Row>
            <Col className={style.section} flex={1}>
              <p className={style.fileTips}>
                1、下载产品导入模版，根据模版导入产品信息
              </p>
              <Button
                onClick={() => {
                  downloadFile(MasterplateFile.url, MasterplateFile.name);
                }}
              >
                下载模版
              </Button>
            </Col>
            <Col className={style.section} flex={1}>
              <p className={style.fileTips}>
                2、上传文件，支持格式为：xls、xlsx，文件最大5M
              </p>
              {fileListParams ? (
                <div className={style.fileListBack}>
                  <div className={style.fileListBackFile}>
                    <IconFont
                      className={style.fileIcon}
                      icon='icon-icon-Excel'
                    />
                    <span>{fileListParams.fileName}</span>
                  </div>
                  <div className={style.uploadWrapper}>
                    <Upload className={style.upload} {...fileProps}>
                      <Button loading={btnLoading}>重新上传</Button>
                    </Upload>
                    <Button
                      loading={importBtnLoading}
                      onClick={() => {
                        const { name = '', url = '' } = fileListParams;
                        const result = {
                          fileName: name,
                          type: Number(modelType),
                          filePath: url,
                        };
                        setImportBtnLoading(true);
                        /** 新增导入 */
                        postFootprintFileUpload({
                          fileUpload: result,
                        }).then(({ data }) => {
                          if (data.code === 200) {
                            onUploadFileApiFn(data?.data?.id);
                          }
                        });
                      }}
                      type='primary'
                    >
                      导入
                    </Button>
                  </div>
                </div>
              ) : (
                <Upload {...fileProps}>
                  <Button loading={btnLoading}>上传文件</Button>
                </Upload>
              )}
            </Col>
          </Row>
        </div>
      </div>
      <div>
        <h4>导入历史</h4>
        <TableRender
          searchProps={{
            hidden: true,
            schema: { type: 'void', properties: {} },
            searchOnMount: false,
            api: searchApi,
          }}
          tableProps={{
            columns: changeTableColumsNoText(
              [...indexColumn, ...columns()],
              '-',
            ),
            pageChangeWithRequest: false,
            pagination: {
              pageSize: searchParams?.pageSize
                ? +searchParams.pageSize
                : undefined,
              current: searchParams?.current
                ? +searchParams.current
                : undefined,
              size: 'default',

              onChange: (page, pageSize) => {
                searchApi({
                  current: page,
                  pageSize,
                  type: modelType,
                });
              },
            },
          }}
        />
      </div>
      <FormActions
        place='center'
        buttons={[
          {
            title: '返回',
            onClick: async () => history.back(),
          },
        ]}
      />
    </div>
  );
}
export default withTable(ImportFile);
