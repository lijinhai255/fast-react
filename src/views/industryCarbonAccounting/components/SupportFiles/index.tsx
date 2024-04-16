/**
 * @description 支撑材料类型
 */
import { ProTable } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import { keyBy } from 'lodash-es';
import { useMemo, useRef } from 'react';

import { Page } from '@/components/Page';
import {
  getEnterprisesystemSysBusinessSupportPage,
  SysBusinessSupport,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';

import { columns } from './columns';
import { ClassifyProps } from '../../utils/type';

const SupportFiles = ({
  isViewMode,
  selectedClassifyItem,
}: {
  /** 查看模式 */
  isViewMode: boolean;
  /** 选中的分类项数据 */
  selectedClassifyItem?: ClassifyProps;
}) => {
  const { classifyId } = selectedClassifyItem || {};

  const tableRef = useRef<ActionType>();

  const columnsStateDefault = useMemo(() => {
    return keyBy(columns, 'dataIndex');
  }, []);

  return (
    <Page title={undefined}>
      <ProTable<SysBusinessSupport>
        columns={columns({
          isViewMode,
        })}
        actionRef={tableRef}
        pagination={false}
        search={false}
        columnsState={{
          persistenceKey: 'SupportFiles',
          persistenceType: 'localStorage',
          defaultValue: columnsStateDefault,
        }}
        toolBarRender={false}
        params={{
          classifyId,
        }}
        request={async params => {
          return getEnterprisesystemSysBusinessSupportPage({
            classifyId: params.classifyId,
          }).then(({ data }) => {
            return {
              data: data?.data.map((item, index) => ({
                ...item,
                allIndex: index + 1,
              })),
              success: true,
            };
          });
        }}
      />
    </Page>
  );
};
export default SupportFiles;
