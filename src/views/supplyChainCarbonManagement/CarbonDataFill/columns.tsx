import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { Tags } from '@/components/Tags';
import { checkAuth } from '@/layout/utills';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import {
  ApplyInfo,
  postSupplychainDataFillSubmit,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { Toast, modalText } from '@/utils';
import { modelFooterBtnStyle } from '@/views/carbonFootPrint/utils/index';
import AuditConfigTable from '@/views/components/AuditConfigTable';
import { ADUDIT_REQUIRED_TYPE } from '@/views/dashborad/Approval/Info/constant';

import { getAuditConfig } from './service';
import { CarbonFillType } from '../utils';

const { NOT_REQUIRED } = ADUDIT_REQUIRED_TYPE;

export const columns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
}): TableRenderProps<ApplyInfo>['columns'] => [
  {
    title: '客户名称',
    dataIndex: 'companyName',
    fixed: 'left',
  },
  {
    title: '数据类型',
    dataIndex: 'dataType_name',
  },
  {
    title: '数据要求',
    dataIndex: 'dataRequire',
  },
  {
    title: '联系人',
    dataIndex: 'applyRealName',
    width: 100,
  },
  {
    title: '联系方式',
    dataIndex: 'applyMobile',
  },
  {
    title: '申请时间',
    dataIndex: 'applyTime',
    width: 180,
  },
  {
    title: '截止日期',
    dataIndex: 'deadline',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'applyStatus_name',
    render: (value, record) => {
      const text =
        Number(record?.applyStatus) === 0
          ? '待填报'
          : Number(record?.applyStatus) === 1
          ? '已填报'
          : value;
      /** 0 待填报 1 已填报 2 待审核 3 审核通过 4 审核不通过 */
      const status = {
        0: 'default',
        1: 'blue',
        2: 'orange',
        3: 'green',
        4: 'red',
      };
      return (
        <Tags
          className='customTag'
          kind='raduis'
          color={status[record?.applyStatus as unknown as keyof typeof status]}
          tagText={` ${text}`}
        />
      );
    },
  },
  {
    title: '提交时间',
    dataIndex: 'submitTime',
    width: 180,
  },
  {
    title: '操作',
    dataIndex: 'applyStatus',
    width: 150,
    render: (value, row) => {
      /** 0 未填报 1 已填报 2 待审核 3 审核通过 4 审核不通过,可用值
       * 填报：[0, 1, 4]
       * 提交：[1, 4]
       * 查看：[0, 1, 2, 3, 4]
       */
      const { id, dataType, year, dataRequire, questionnaireName } = row;
      const { carbonFootPrint, questionnaire } = CarbonFillType;
      const isProduct = Number(dataType) === carbonFootPrint;
      const text = isProduct
        ? `${dataRequire?.split('：')[0]}：产品碳足迹${
            dataRequire?.split('：')[1]
          }`
        : `企业碳排放：${year}年`;
      const isQuestionnaire = Number(dataType) === questionnaire;
      return (
        <TableActions
          menus={compact([
            [0, 1, 4].includes(Number(value)) &&
              checkAuth('/supplyChain/carbonDataFill/fill', {
                label: '填报',
                key: '填报',
                onClick: async () => {
                  const pageInfoType =
                    Number(value) === 0 ? PageTypeInfo.add : PageTypeInfo.edit;
                  navigate(
                    virtualLinkTransform(
                      SccmRouteMaps.sccmFillInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [pageInfoType, id],
                    ),
                  );
                },
              }),
            [1, 4].includes(Number(value)) &&
              checkAuth('/supplyChain/carbonDataFill/submit', {
                label: '提交',
                key: '提交',
                onClick: async () => {
                  const { data } = await getAuditConfig({
                    applyInfoId: Number(id),
                  });

                  const { auditRequired, nodeList } = data?.data || {};

                  Modal.confirm({
                    title: '提示',
                    icon: '',
                    content:
                      /** 不需要审批 则展示弹窗提示 否则展示审批路程 */
                      auditRequired === NOT_REQUIRED ? (
                        <span>
                          确认提交该数据：
                          {isQuestionnaire ? (
                            <span className={modalText}>
                              问卷名称：{questionnaireName}?
                            </span>
                          ) : (
                            <span className={modalText}>{text}?</span>
                          )}
                        </span>
                      ) : (
                        <AuditConfigTable dataSource={nodeList} />
                      ),
                    ...modelFooterBtnStyle,
                    onOk: () => {
                      if (!id) return {};
                      return postSupplychainDataFillSubmit({
                        req: {
                          id,
                        },
                      }).then(({ data }) => {
                        if (data.code === 200) {
                          Toast('success', '提交成功');
                          refresh?.();
                        }
                      });
                    },
                  });
                },
              }),
            [0, 1, 2, 3, 4].includes(Number(value)) &&
              checkAuth('/supplyChain/carbonDataFill/detail', {
                label: '查看',
                key: '查看',
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      SccmRouteMaps.sccmFillInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [PageTypeInfo.show, id],
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
