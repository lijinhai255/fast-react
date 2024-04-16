/*
 * @@description: 待审核人弹窗
 */
import { Popover, Table } from 'antd';
import { ReactNode, useEffect, useState } from 'react';

import {
  AuditUserDto,
  getEnterprisesystemAuditUserPage,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';

import { columns } from './columns';
import style from './index.module.less';

/** 待审核人的列表 */
export const ApproverList = ({ id }: { id?: number }) => {
  /** 页码参数 */
  const [searchParams, setSearchParams] = useState<{
    current: number;
    pageSize?: number;
  }>({
    current: 1,
    pageSize: 10,
  });

  /** 表格数据 */
  const [tableData, setTableData] = useState<AuditUserDto[]>();

  /** 表格数据总数 */
  const [total, setTotal] = useState<number>(0);

  /** 表格loading */
  const [loading, changeLoading] = useState(false);

  useEffect(() => {
    if (id) {
      changeLoading(true);
      getEnterprisesystemAuditUserPage({
        id,
        pageNum: searchParams.current || 1,
        pageSize: searchParams.pageSize || 10,
      }).then(({ data }) => {
        changeLoading(false);
        setTableData(data.data.list);
        setTotal(data.data.total || 0);
      });
    }
  }, [id, searchParams]);
  return (
    <Table
      loading={loading}
      columns={columns()}
      dataSource={tableData}
      pagination={
        searchParams
          ? {
              pageSize: searchParams?.pageSize
                ? +searchParams.pageSize
                : undefined,
              current: searchParams?.current
                ? +searchParams.current
                : undefined,
              total,
              size: 'default',
              onChange: (current: number, pageSize: number) => {
                setSearchParams({
                  current,
                  pageSize,
                });
              },
            }
          : false
      }
    />
  );
};

/** 待审核人的气泡卡片 */
export const ApproverPopover = ({
  id,
  children,
}: {
  /** 审核数据的id */
  id?: number;
  children: ReactNode;
}) => {
  return (
    <Popover
      placement='left'
      title='待审核人'
      content={
        <div className={style.approverPopover}>
          <ApproverList id={id} />
        </div>
      }
      trigger='click'
    >
      {children && <p className={style.childrenContent}>{children}</p>}
    </Popover>
  );
};
