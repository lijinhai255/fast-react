/*
 * @@description: 供应链碳管理-碳数据填报-详情-数据填报-企业碳核算-核算过程-选择碳排放核算
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-06 16:48:59
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-15 23:56:33
 */

import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  ComputationDto,
  getSupplychainDataProcessComputationChooseApplyInfoId,
  postSupplychainDataProcessComputationChooseApplyInfoId,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import LocalStore from '@/utils/store';
import style from '@/views/supplyChainCarbonManagement/SupplierManagement/Info/index.module.less';
import TableList from '@/views/supplyChainCarbonManagement/components/Table';
import { SELECT_BACK_KEY } from '@/views/supplyChainCarbonManagement/utils';

import { columns } from './utils/columns';

function Select() {
  const navigate = useNavigate();
  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();

  /** 表格加载 */
  const [loading, changeLoading] = useState(false);

  /** 表格数据 */
  const [tableData, setTableData] = useState<ComputationDto[]>();

  /** 选中的数据Key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /** 获取碳排放核算列表 */
  useEffect(() => {
    if (id) {
      changeLoading(true);
      getSupplychainDataProcessComputationChooseApplyInfoId({
        applyInfoId: Number(id),
      }).then(({ data }) => {
        if (data.code === 200) {
          changeLoading(false);
          setTableData(data.data ? [data.data] : []);
        }
      });
    }
  }, [id]);

  /** 选中表格 */
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  /** 选择项配置 */
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <div className={style.supplyManagementInfoWrapper}>
      <Page title='选择碳排放核算'>
        <TableList
          loading={loading}
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
          columns={columns({ pageTypeInfo, id, navigate })}
          dataSource={tableData}
        />
      </Page>
      <FormActions
        place='center'
        buttons={compact([
          {
            title: '确定',
            type: 'primary',
            disabled: selectedRowKeys.length === 0,
            onClick: async () => {
              postSupplychainDataProcessComputationChooseApplyInfoId({
                applyInfoId: Number(id),
              }).then(({ data }) => {
                if (data.code === 200) {
                  LocalStore.setValue(SELECT_BACK_KEY, {
                    currentTab: '2',
                  });
                  history.back();
                }
              });
            },
          },
          {
            title: '取消',
            onClick: async () => {
              LocalStore.setValue(SELECT_BACK_KEY, {
                currentTab: '2',
              });
              history.back();
            },
          },
        ])}
      />
    </div>
  );
}
export default Select;
