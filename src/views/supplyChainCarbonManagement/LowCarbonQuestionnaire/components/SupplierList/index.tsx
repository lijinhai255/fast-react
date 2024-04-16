/*
 * @@description:
 */
/*
 * @@description: 供应链碳管理-低碳问卷-详情-供应商列表
 */
import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { withTable } from 'table-render';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { getFootprintProductionProps } from '@/sdks/footprintV2ApiDocs';
import {
  getSupplychainSupplierPage,
  Supplier,
} from '@/sdks_v2/new/supplychainV2ApiDocs';

import style from './index.module.less';
import { columns } from './utils/columns';
import { searchSchema } from './utils/schemas';

function SupplierList({
  saveSupplierFn,
  orgId,
}: {
  saveSupplierFn: (value: number[]) => void;
  orgId: number;
}) {
  /** 所有的供应商ID数组 */
  const [allSupplierIdArr, setAllSupplierIdArr] = useState<number[]>([]);

  /** 指定选中的供应商列表 */
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  /** 全选按钮是否是半选 */
  const [indeterminate, setIndeterminate] = useState(false);
  /** 是否是全选 */
  const [checkAll, setCheckAll] = useState(false);
  /** 点击全选按钮 */
  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    const { checked } = e.target;
    setIndeterminate(false);
    setCheckAll(checked);
    if (checked) {
      setSelectedRowKeys(allSupplierIdArr);
      saveSupplierFn(allSupplierIdArr);
    } else {
      setSelectedRowKeys([]);
    }
  };

  /** 供应商列表 */
  const searchApi: CustomSearchProps<
    Supplier,
    getFootprintProductionProps
  > = async args => {
    const { pageNum, pageSize } = args || {};
    const { data } = await getSupplychainSupplierPage({
      ...args,
      supplierStatus: '1',
      orgId,
      pageNum,
      pageSize,
    });
    return {
      ...data?.data,
    };
  };

  const rowSelection = {
    onChange: (selectedRowKey: React.Key[]) => {
      const selectedNum = selectedRowKey?.length;
      const total = allSupplierIdArr?.length;
      saveSupplierFn(selectedRowKey as number[]);
      setSelectedRowKeys(selectedRowKey as number[]);
      /** 控制全选按钮状态反显 */
      setCheckAll(selectedNum > 0 && selectedNum === total);
      setIndeterminate(selectedNum > 0 && selectedNum !== total);
    },
    selectedRowKeys,
    preserveSelectedRowKeys: true,
  };

  useEffect(() => {
    getSupplychainSupplierPage({
      supplierStatus: '1',
      orgId,
      pageNum: 1,
      pageSize: 100,
    }).then(res => {
      const { list } = res?.data?.data || [];
      setCheckAll(false);
      setIndeterminate(false);
      /** 获得所有供应商的ID数组 */
      const allSupplierId = compact(
        list?.map(item => {
          return item.id;
        }),
      );
      setAllSupplierIdArr(allSupplierId);
    });
  }, []);

  return (
    <Page wrapperClass={style.supplierListWrapper} title='供应商列表'>
      <TableRender
        searchProps={{
          schema: searchSchema(),
          api: searchApi,
        }}
        tableProps={{
          columns: columns(),
          rowSelection: { ...rowSelection },
        }}
        autoAddIndexColumn
        autoFixNoText
        autoSaveSearchInfo
      />
      <div className={style.checkAll}>
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          全选
        </Checkbox>
        <span className={style.selectedNum}>
          已选择{selectedRowKeys?.length}条数据
        </span>
      </div>
    </Page>
  );
}
export default withTable(SupplierList);
