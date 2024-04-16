/*
 * @@description:
 */
/*
 * @@description:核算模型
 */
import { PlusOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import { checkAuth } from '@/layout/utills';
import {
  getComputationModelPage,
  getComputationModelPageProps,
  Model,
} from '@/sdks/computation/computationV2ApiDocs';
import { changeTableColumsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import { AccountingModel } from './model';
import { columns, SearchSchema } from './utils/columns';

const Users = () => {
  // 控制核算模型 新增 编辑 详情
  const [status, setStatus] = useState<
    'ADD' | 'SHOW' | 'EDIT' | 'COPY' | 'DEL'
  >('ADD');
  // 控制弹窗 显隐
  const [visable, changeVisAble] = useState(false);
  // 弹窗表单赋值
  const [initValue, changeInitValue] = useState<Model>({});
  const [searchParams, setSearchParams] =
    useState<getComputationModelPageProps>(
      getSearchParams<getComputationModelPageProps>()[0],
    );
  const { refresh, form } = useTable();
  const navigate = useNavigate();

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);
  // @ts-ignore
  const searchApi: SearchProps<getComputationModelPageProps>['api'] = ({
    current,
    ...args
  }) => {
    const pageNum =
      (isFirstLoad.current ? searchParams.pageNum : current) || current;
    let newSearch = {
      ...args,
      ...searchParams,
      pageNum,
    } as getComputationModelPageProps;
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        pageNum,
      } as getComputationModelPageProps;
      updateUrl(args);
    } else {
      form.setValues(newSearch);
    }
    setSearchParams({
      ...newSearch,
    });
    isFirstLoad.current = false;
    return getComputationModelPage({
      ...newSearch,
    }).then(({ data }) => {
      return {
        rows: data?.data?.list,
        total: data?.data?.total,
      };
    });
  };
  // 复制、编辑 查看
  const editFn = (record: Model) => {
    changeInitValue({ ...record });
    setStatus('EDIT');
    changeVisAble(true);
  };
  const copyFn = (record: Model) => {
    changeInitValue({ ...record, modelName: `${record?.modelName}副本` });
    setStatus('COPY');
    changeVisAble(true);
  };
  const showFn = (record: Model) => {
    changeInitValue({ ...record });
    setStatus('SHOW');
    changeVisAble(true);
  };
  return (
    <Page
      title='核算模型'
      onBtnClick={async () => {
        setStatus('ADD');
        changeVisAble(true);
        changeInitValue({});
      }}
      actionBtnChild={checkAuth(
        '/accountingModel/add',
        <div>
          <PlusOutlined /> 新增
        </div>,
      )}
    >
      <TableRender
        searchProps={{
          schema: SearchSchema(),
          api: searchApi,
        }}
        tableProps={{
          columns: changeTableColumsNoText(
            [
              ...indexColumn,
              ...columns({ refresh, navigate, editFn, copyFn, showFn }),
            ],
            '-',
          ),
          pagination: {
            pageSize: searchParams?.pageSize
              ? +searchParams.pageSize
              : undefined,
            current: searchParams?.pageNum ? +searchParams.pageNum : undefined,
            size: 'default',
          },
          scroll: { x: 1200 },
        }}
      />
      <AccountingModel
        status={status}
        visable={visable}
        onCancelFn={() => {
          changeVisAble(false);
        }}
        onOkFn={() => {
          changeVisAble(false);
          refresh?.();
        }}
        initValue={initValue}
      />
    </Page>
  );
};

export default withTable(Users);
