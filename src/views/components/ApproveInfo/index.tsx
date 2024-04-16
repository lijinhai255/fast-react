/*
 * @@description: 审核详情
 */
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { keyBy } from 'lodash-es';
import { useMemo } from 'react';

import { Tags } from '@/components/Tags';

import style from './index.module.less';

function ApproveInfo<
  ProcessType extends object & {
    auditStatus?: number;
    auditStatus_name?: string;
  } = any,
  RecordType extends object & {
    auditStatus?: number;
    auditStatus_name?: string;
  } = any,
>({
  processDataSource = [],
  recordDataSource = [],
}: {
  processDataSource?: ProcessType[];
  recordDataSource?: RecordType[];
}) {
  const processColumns = (): ProColumns<ProcessType>[] => [
    {
      title: '审核阶段',
      dataIndex: 'nodeName',
      ellipsis: true,
    },
    {
      title: '审核配置',
      dataIndex: 'targetNames',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'auditStatus_name',
      render: (_, record) => {
        const { auditStatus, auditStatus_name } = record || {};
        const status = {
          0: 'orange',
          1: 'green',
          2: 'red',
        };
        return (
          <Tags
            className='customTag'
            kind='raduis'
            color={status[auditStatus as unknown as keyof typeof status]}
            tagText={auditStatus_name || ''}
          />
        );
      },
    },
  ];

  const recordColumns = (): ProColumns<RecordType>[] => [
    {
      title: '序号',
      dataIndex: 'allIndex',
    },
    {
      title: '审核结果',
      dataIndex: 'auditStatus_name',
      render: (_, record) => {
        const { auditStatus_name = '', auditStatus } = record || {};
        const status = {
          1: 'green',
          2: 'red',
          3: 'orange',
        };
        return (
          <Tags
            className='customTag'
            kind='raduis'
            color={status[auditStatus as unknown as keyof typeof status]}
            tagText={auditStatus_name || ''}
          />
        );
      },
    },
    {
      title: '审核人',
      dataIndex: 'auditByName',
      ellipsis: true,
    },
    {
      title: '审核备注',
      dataIndex: 'auditComment',
      ellipsis: true,
    },
    {
      title: '审核时间',
      dataIndex: 'auditTime',
    },
  ];

  const processColumnsStateDefault = useMemo(() => {
    return keyBy(processColumns, 'dataIndex');
  }, []);
  const recordColumnsStateDefault = useMemo(() => {
    return keyBy(recordColumns, 'dataIndex');
  }, []);

  return (
    <div className={style.wrapper}>
      <section className={style.content}>
        <h4>审核流程</h4>
        <ProTable<ProcessType>
          columns={processColumns()}
          pagination={false}
          search={false}
          columnsState={{
            persistenceKey: 'ProcessTable',
            persistenceType: 'localStorage',
            defaultValue: processColumnsStateDefault,
          }}
          toolBarRender={false}
          params={{
            processTableData: processDataSource,
          }}
          request={async params => {
            const { processTableData } = params || {};
            return {
              data: processTableData,
              success: true,
            };
          }}
        />
      </section>
      <section className={style.content}>
        <h4>审核记录</h4>
        <ProTable<RecordType>
          columns={recordColumns()}
          pagination={false}
          search={false}
          columnsState={{
            persistenceKey: 'RecordTable',
            persistenceType: 'localStorage',
            defaultValue: recordColumnsStateDefault,
          }}
          toolBarRender={false}
          params={{
            recordTableData: recordDataSource,
          }}
          request={async params => {
            const { recordTableData } = params || {};
            return {
              data: recordTableData?.map((item: RecordType, index: number) => ({
                ...item,
                allIndex: index + 1,
              })),
              success: true,
            };
          }}
        />
      </section>
    </div>
  );
}
export default ApproveInfo;
