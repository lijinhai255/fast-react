/*
 * @@description: 企业碳核算-核算过程
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-25 14:46:04
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-18 23:42:23
 */
import { ColumnsType } from 'antd/lib/table';
import { compact } from 'lodash-es';

import { TableActions } from '@/components/Table/TableActions';
import { ComputationProcess } from '@/sdks_v2/new/supplychainV2ApiDocs';
import TableList from '@/views/supplyChainCarbonManagement/components/Table';

import { columns } from './utils/columns';
import { CarbonDataPropsType } from '../../utils/type';
import CommonHeader from '../CommonHeader';

function CarbonAccountingProcess({
  /** 顶部展示的信息 */
  basicInfo,
  /** 过程数据 */
  computationProcess,
  /** 列表加载loading */
  loading,
  /** 总页数 */
  total,
  /** 页码配置 */
  searchParams,
  /** 切换分页的按钮 */
  onchange,
  /** 列表查看按钮事件 */
  onDetailClick,
}: CarbonDataPropsType) {
  /** 表格操作栏 */
  const actionColumns: ColumnsType<ComputationProcess> = [
    {
      title: '操作',
      dataIndex: 'action',
      width: 100,
      render: (_, row) => {
        return (
          <TableActions
            menus={compact([
              {
                label: '查看',
                key: '查看',
                onClick: async () => {
                  onDetailClick?.(row);
                },
              },
            ])}
          />
        );
      },
    },
  ];

  /** 表格表头 */
  const column = [...columns(), ...actionColumns];
  return (
    <main>
      <CommonHeader basicInfo={basicInfo} />
      <TableList
        columns={column}
        dataSource={computationProcess}
        loading={loading}
        total={total}
        searchParams={searchParams}
        onchange={onchange}
      />
    </main>
  );
}
export default CarbonAccountingProcess;
