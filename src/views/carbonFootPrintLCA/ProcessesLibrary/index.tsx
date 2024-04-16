/**
 * @description 过程库列表页
 */
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';
import { LCARouteMaps } from '@/router/utils/lcaEnums';

import { columns } from './columns';
import { searchSchema } from './schemas';
import {
  getProcessLibraryDetail,
  getProcessLibraryList,
  postProcessLibraryAdd,
  postProcessLibraryCopy,
  postProcessLibraryEdit,
} from './service';
import { ProcessLibrary, Request } from './type';
import ProcessDescribeDrawer from '../components/ProcessDescribeDrawer';

const { add, edit, copy } = PageTypeInfo;

const ProductManagement = () => {
  const navigate = useNavigate();
  const { refresh } = useTable();

  /** 所属组织枚举 暂时去掉 */
  // const orgList = useOrgs();

  /** 列表操作按钮的类型 */
  const [actionBtnType, setActionBtnType] = useState<string>();

  /** 控制过程详情的抽屉 */
  const [open, setOpen] = useState(false);

  /** 过程ID */
  const [processId, setProcessId] = useState<number>();

  /** 过程详情数据 */
  const [processDataSource, setProcessDataSource] = useState<ProcessLibrary>();

  /** 保存需要的APi */
  const apiMap = {
    [add]: postProcessLibraryAdd,
    [edit]: postProcessLibraryEdit,
    [copy]: postProcessLibraryCopy,
  };

  /** 列表操作按钮 */
  const onActionBtnClick = (type: string, id?: number) => {
    /** 操作按钮的类型 */
    setActionBtnType(type);
    /* 打开详情抽屉 */
    setOpen(true);
    /** 过程id */
    setProcessId(id);
  };

  /** 初始化 */
  const onInit = () => {
    setActionBtnType(undefined);
    setProcessId(undefined);
    setProcessDataSource(undefined);
    setOpen(false);
  };

  /** 列表数据 */
  const searchApi: CustomSearchProps<ProcessLibrary, Request> = args =>
    getProcessLibraryList(args).then(({ data }) => {
      return data?.data;
    });

  /** 过程详情数据 */
  useEffect(() => {
    if (processId) {
      getProcessLibraryDetail({ id: processId }).then(({ data }) => {
        setProcessDataSource(data?.data);
      });
    }
  }, [processId]);
  return (
    <Page
      title='过程库'
      onBtnClick={async () => {
        setActionBtnType(add);
        setOpen(true);
        setProcessId(undefined);
      }}
      actionBtnChild={checkAuth(
        '/carbonFootprintLCA/processLibrary/add',
        <div>
          <PlusOutlined /> 新增
        </div>,
      )}
    >
      <TableRender<ProcessLibrary, Request>
        searchProps={{
          schema: searchSchema(),
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ navigate, refresh, onActionBtnClick }),
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
      {/* 过程详情抽屉 */}
      <ProcessDescribeDrawer<ProcessLibrary>
        actionBtnType={actionBtnType}
        open={open}
        processDescDataSource={processDataSource}
        onSave={async (
          processDescData: ProcessLibrary,
          successCallBack,
          failCallBack,
        ) => {
          const postApi = apiMap[actionBtnType as keyof typeof apiMap];
          try {
            const { data } = await postApi({
              ...processDescData,
              srcProcessLibraryId:
                actionBtnType === copy ? processId : undefined,
            });
            successCallBack();
            onInit();
            navigate({
              pathname: LCARouteMaps.lcaProcessLibraryInfo.replace(
                ':pageTypeInfo',
                `${edit}`,
              ),
              search: `id=${data?.data}`,
            });
          } catch (e) {
            failCallBack();
          }
        }}
        onClose={() => onInit()}
      />
    </Page>
  );
};
export default withTable(ProductManagement);
