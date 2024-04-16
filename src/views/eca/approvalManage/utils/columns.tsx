import { Button, Popover } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import {
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render/dist/src/types';

import { auditDataColor, CustomTag } from '@/components/CustomTag';
import { TableActions } from '@/components/Table/TableActions';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { useAsyncEnums } from '@/hooks';
import { checkAuth } from '@/layout/utills';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { AuditData } from '@/sdks/Newcomputation/computationV2ApiDocs';

import { ApproveUserList } from '../PendReviewModal';

export const columns = ({
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
  PendReviewModalFn?: (record: AuditData) => void;
}): TableRenderProps<AuditData>['columns'] => [
  {
    title: '审核内容',
    dataIndex: 'auditType_name',
    // copyable: true,
  },
  {
    title: '所属组织',
    width: 120,
    dataIndex: 'orgName',
  },
  {
    title: '提交人',
    dataIndex: 'createByName',
    width: 120,
  },

  {
    title: '提交时间',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '审核状态',
    dataIndex: 'auditStatus',
    width: 100,
    render: (value: keyof typeof auditDataColor, record) => {
      return (
        <CustomTag
          color={auditDataColor[value]}
          text={record?.auditStatus_name || '-'}
        />
      );
    },
  },
  {
    title: '待审核人',
    dataIndex: 'targetNames',
    ellipsis: true,
    render: (targetNames, record) => {
      const content = (
        <div style={{ width: '500px' }}>
          <ApproveUserList id={record?.id || 0} />
        </div>
      );
      return Number(record?.auditStatus) === 0 ? (
        <Popover
          placement='left'
          title='待审核人'
          content={content}
          trigger='click'
        >
          <Button type='link' style={{ paddingLeft: 0 }}>
            {targetNames}
          </Button>
        </Popover>
      ) : (
        '-'
      );
    },
  },
  {
    title: '操作',
    width: 160,
    render(_, record) {
      const { id, dataId, auditStatus } = record || {};
      return (
        <TableActions
          menus={compact([
            Number(record?.auditStatus) === 0 &&
              record?.userBtnFlag === true &&
              checkAuth('/approvalManage/Info', {
                label: '审核',
                key: '审核',
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.approvalManageInfo,
                      [PAGE_TYPE_VAR, ':id', ':dataId', ':auditStatus'],
                      [PageTypeInfo.edit, id, dataId, auditStatus],
                    ),
                  );
                },
              }),
            checkAuth('/approvalManageInfo/Detail', {
              label: '查看',
              key: '查看',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.approvalManageInfo,
                    [PAGE_TYPE_VAR, ':id', ':dataId', ':auditStatus'],
                    [PageTypeInfo.show, id, dataId, auditStatus],
                  ),
                );
              },
            }),
          ])}
        />
      );
    },
  },
];
export const SearchSchema = (): SearchProps<any>['schema'] => {
  const DataStatus = useAsyncEnums('AuditStatus');

  return {
    type: 'object',
    properties: {
      auditStatus: xRenderSeachSchema({
        type: 'string',
        placeholder: '审核状态',
        enum: DataStatus.map(org => String(org.code)),
        enumNames: DataStatus.map(org => org.name as string),
        widget: 'select',
        props: {
          allowClear: true,
        },
      }),
    },
  };
};
