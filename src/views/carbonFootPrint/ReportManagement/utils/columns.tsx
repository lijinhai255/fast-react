/*
 * @@description: 碳足迹报告-表头文件
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-27 14:17:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-01-10 14:54:53
 */

import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import submitSuccess from '@/image/submitSuccess.png';
import { checkAuth } from '@/layout/utills';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  Report,
  deleteFootprintReport,
  postFootprintFileDownload,
} from '@/sdks/footprintV2ApiDocs';
import { Toast, modalText } from '@/utils';
import { modelFooterBtnStyle } from '@/views/carbonFootPrint/utils/index';

import style from '../index.module.less';

/** 碳足迹报告-列表-表头 */
export const reportColumns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
}): TableRenderProps<Report>['columns'] => [
  {
    title: '报告名称',
    dataIndex: 'reportName',
    fixed: 'left',
  },
  {
    title: '所属组织',
    dataIndex: 'orgName',
  },
  {
    title: '功能单位',
    dataIndex: 'functionalUnit',
  },
  {
    title: '产品名称',
    dataIndex: 'productionName',
  },
  {
    title: '核算周期',
    dataIndex: 'basicUnit',
    render: (_, record) => `${record.beginDate} 至 ${record.endTime}`,
    width: 220,
  },
  {
    title: '产品编码',
    dataIndex: 'productionCode',
  },
  {
    title: '更新人',
    dataIndex: 'updateByName',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 180,
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: 230,
    render: (_, row) => {
      const { id, reportName, productionBusinessId } = row || {};
      return (
        <TableActions
          menus={compact([
            checkAuth('/carbonFootPrint/report/create', {
              label: '生成报告',
              key: '生成报告',
              onClick: async () => {
                Modal.confirm({
                  title: '生成报告',
                  icon: '',
                  content: (
                    <div className={style.confirmContentWrapper}>
                      <img className={style.icon} src={submitSuccess} alt='' />
                      <p className={style.content}>生成报告任务已创建</p>
                      <p className={style.tips}>
                        点击“确定”跳转到“下载管理”中下载
                      </p>
                    </div>
                  ),
                  ...modelFooterBtnStyle,
                  onOk: () => {
                    const stamp = new Date().getTime();
                    const params = {
                      fileName: `${reportName}-${stamp}.docx`,
                      reportId: id,
                    };
                    return postFootprintFileDownload({
                      fileDownload: params,
                    }).then(({ data }) => {
                      if (data.code === 200) {
                        navigate(RouteMaps.systemDownload);
                      }
                    });
                  },
                });
              },
            }),
            checkAuth('/carbonFootPrint/report/edit', {
              label: '编辑',
              key: '编辑',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    RouteMaps.carbonFootPrintReportInfo,
                    [PAGE_TYPE_VAR, ':id', ':functionUnitId'],
                    [PageTypeInfo.edit, id, productionBusinessId],
                  ),
                );
              },
            }),
            checkAuth('/carbonFootPrint/report/del', {
              label: '删除',
              key: '删除',
              onClick: async () => {
                Modal.confirm({
                  title: '提示',
                  icon: '',
                  content: (
                    <span>
                      确认删除该报告：
                      <span className={modalText}>{reportName}?</span>
                    </span>
                  ),
                  ...modelFooterBtnStyle,
                  onOk: () => {
                    if (!id) return {};
                    return deleteFootprintReport({
                      id,
                    }).then(({ data }) => {
                      if (data.code === 200) {
                        Toast('success', '删除成功');
                        refresh?.();
                      }
                    });
                  },
                });
              },
            }),
            checkAuth('/carbonFootPrint/report/detail', {
              label: '查看',
              key: '查看',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    RouteMaps.carbonFootPrintReportInfo,
                    [PAGE_TYPE_VAR, ':id', ':functionUnitId'],
                    [PageTypeInfo.show, id, productionBusinessId],
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
