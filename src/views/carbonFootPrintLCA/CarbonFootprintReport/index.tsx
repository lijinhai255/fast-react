/*
 * @@description:
 */
/**
 * @description 碳足迹报告列表页
 */

import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useTable, withTable } from 'table-render';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';

import { CarbonFootprintReportInfo } from './Info';
import { columns } from './columns';
import { searchSchema } from './schemas';
import { getReportList } from './service';
import { Report, Request } from './type';

const { add } = PageTypeInfo;

const CarbonFootprintReport = () => {
  const { refresh } = useTable();

  /** 所属组织枚举 */
  const orgList = useOrgs();

  /** 控制报告详情的抽屉 */
  const [open, setOpen] = useState(false);

  /** 报告ID */
  const [reportId, setReportId] = useState<number>();

  /** 列表操作按钮的类型 */
  const [actionBtnType, setActionBtnType] = useState<string>();

  /** 列表操作按钮 */
  const onActionBtnClick = (type: string, id?: number) => {
    /** 操作按钮的类型 */
    setActionBtnType(type);
    /** 报告id */
    setReportId(id);
    /* 打开详情抽屉 */
    setOpen(true);
  };

  const onInit = () => {
    setReportId(undefined);
    setActionBtnType(undefined);
    setOpen(false);
  };

  const searchApi: CustomSearchProps<Report, Request> = args =>
    getReportList(args).then(({ data }) => {
      return data?.data;
    });

  return (
    <Page
      title='碳足迹报告'
      onBtnClick={async () => {
        setActionBtnType?.(add);
        setReportId(undefined);
        setOpen(true);
      }}
      actionBtnChild={checkAuth(
        '/carbonFootprintLCA/report/add',
        <div>
          <PlusOutlined /> 新增
        </div>,
      )}
    >
      <TableRender<Report, Request>
        searchProps={{
          schema: searchSchema(orgList),
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ refresh, onActionBtnClick }),
          scroll: { x: 1800 },
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
      {/* 碳足迹报告详情抽屉 */}
      <CarbonFootprintReportInfo
        open={open}
        reportId={reportId}
        actionBtnType={actionBtnType}
        orgList={orgList}
        onOk={() => {
          onInit();
          refresh?.();
        }}
        onClose={() => onInit()}
      />
    </Page>
  );
};
export default withTable(CarbonFootprintReport);
